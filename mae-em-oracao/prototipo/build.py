"""Gera o protótipo (index.html) e o texto revisável (devocionais.md) a partir de conteudo/devocionais.json."""
import json, pathlib

raiz = pathlib.Path(__file__).resolve().parent.parent
dados = json.loads((raiz / "conteudo" / "devocionais.json").read_text(encoding="utf-8"))

html = (raiz / "prototipo" / "template.html").read_text(encoding="utf-8")
html = html.replace("/*DATA*/[]", json.dumps(dados, ensure_ascii=False))
(raiz / "prototipo" / "index.html").write_text(html, encoding="utf-8")

md = ["# Mãe em Oração — Semana 1\n"]
for d in dados:
    md.append(f"## Dia {d['dia']} · {d['tema']}: {d['titulo']}\n")
    md.append(f"> “{d['versiculo']}” — {d['referencia']}\n")
    md.extend(p + "\n" for p in d["reflexao"])
    md.append(f"**Oração:** {d['oracao']}\n")
    md.append(f"**Prática do dia:** {d['pratica']}\n")
(raiz / "conteudo" / "devocionais.md").write_text("\n".join(md), encoding="utf-8")
print("ok")
