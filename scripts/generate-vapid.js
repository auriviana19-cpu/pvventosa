const webpush = require("web-push");

const keys = webpush.generateVAPIDKeys();

console.log("Adicione estas linhas ao seu .env.local:\n");
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
