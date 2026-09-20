import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import type { AppConfig, PushSubscriptionRecord, Rule, RuleType } from "./types";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "app.sqlite");

let instance: Database.Database | null = null;

function getDb(): Database.Database {
  if (instance) return instance;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  instance = new Database(DB_PATH);
  instance.pragma("journal_mode = WAL");
  instance.exec(`
    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      fb_access_token TEXT,
      fb_ad_account_ids TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT UNIQUE NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      scope_level TEXT NOT NULL DEFAULT 'account',
      scope_id TEXT,
      scope_name TEXT,
      threshold REAL NOT NULL DEFAULT 0,
      last_fired_at TEXT,
      last_fired_key TEXT
    );
  `);
  return instance;
}

// ---------- config ----------

export function getConfig(): AppConfig {
  const db = getDb();
  const row = db.prepare("SELECT fb_access_token, fb_ad_account_ids FROM config WHERE id = 1").get() as
    | { fb_access_token: string | null; fb_ad_account_ids: string }
    | undefined;
  if (!row) return { fbAccessToken: null, fbAdAccountIds: [] };
  return {
    fbAccessToken: row.fb_access_token,
    fbAdAccountIds: JSON.parse(row.fb_ad_account_ids || "[]"),
  };
}

export function saveConfig(config: AppConfig): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO config (id, fb_access_token, fb_ad_account_ids)
     VALUES (1, ?, ?)
     ON CONFLICT(id) DO UPDATE SET fb_access_token = excluded.fb_access_token,
                                    fb_ad_account_ids = excluded.fb_ad_account_ids`
  ).run(config.fbAccessToken, JSON.stringify(config.fbAdAccountIds));
}

// ---------- push subscriptions ----------

export function listSubscriptions(): PushSubscriptionRecord[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM push_subscriptions").all() as any[];
  return rows.map((r) => ({
    id: r.id,
    endpoint: r.endpoint,
    p256dh: r.p256dh,
    auth: r.auth,
    createdAt: r.created_at,
  }));
}

export function addSubscription(endpoint: string, p256dh: string, auth: string): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO push_subscriptions (endpoint, p256dh, auth) VALUES (?, ?, ?)
     ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth`
  ).run(endpoint, p256dh, auth);
}

export function removeSubscription(endpoint: string): void {
  const db = getDb();
  db.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").run(endpoint);
}

// ---------- rules ----------

function rowToRule(r: any): Rule {
  return {
    id: r.id,
    type: r.type,
    enabled: !!r.enabled,
    scopeLevel: r.scope_level,
    scopeId: r.scope_id,
    scopeName: r.scope_name,
    threshold: r.threshold,
    lastFiredAt: r.last_fired_at,
    lastFiredKey: r.last_fired_key,
  };
}

export function listRules(): Rule[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM rules ORDER BY id DESC").all() as any[];
  return rows.map(rowToRule);
}

export function addRule(input: {
  type: RuleType;
  scopeLevel: "account" | "campaign";
  scopeId: string | null;
  scopeName: string | null;
  threshold: number;
}): Rule {
  const db = getDb();
  const info = db
    .prepare(
      `INSERT INTO rules (type, enabled, scope_level, scope_id, scope_name, threshold)
       VALUES (?, 1, ?, ?, ?, ?)`
    )
    .run(input.type, input.scopeLevel, input.scopeId, input.scopeName, input.threshold);
  const row = db.prepare("SELECT * FROM rules WHERE id = ?").get(info.lastInsertRowid);
  return rowToRule(row);
}

export function deleteRule(id: number): void {
  getDb().prepare("DELETE FROM rules WHERE id = ?").run(id);
}

export function setRuleEnabled(id: number, enabled: boolean): void {
  getDb().prepare("UPDATE rules SET enabled = ? WHERE id = ?").run(enabled ? 1 : 0, id);
}

export function markRuleFired(id: number, key: string): void {
  getDb()
    .prepare("UPDATE rules SET last_fired_at = datetime('now'), last_fired_key = ? WHERE id = ?")
    .run(key, id);
}
