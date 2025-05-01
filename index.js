//  [BWM-XMD QUANTUM EDITION]                                           
//  >> A superposition of elegant code states                           
//  >> Collapsed into optimal execution                                
//  >> Scripted by Ben Whittaker                                  
//  >> Version: 8.3.5-quantum.7

const axios = require('axios');
const cheerio = require('cheerio');
const adams = require("./config");

const fs = require("fs");
const path = require("path");
const { Boom } = require("@hapi/boom");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
    },
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ Bot connected!");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const mtype = Object.keys(msg.message)[0];
    const body = msg.message.conversation || msg.message[mtype]?.text || "";
    const from = msg.key.remoteJid;
// === Commands ===
if (body.startsWith("!ping")) {
  await sock.sendMessage(from, { text: "🥊 Pong! I'm alive." });
    }
    if (body === "!time") {
  const now = new Date().toLocaleString("en-TZ", { timeZone: "Africa/Dar_es_Salaam" });
  await sock.sendMessage(from, { text: `⏰ Sasa ni: ${now}` });
}

if (body === "!hello") {
  await sock.sendMessage(from, { text: "👋 Hello! Karibu kwenye bot ya Ben Whittaker Tech." });
}

if (body === "!joke") {
  const jokes = [
    "Why don’t eggs tell jokes? Because they’d crack each other up!",
    "Why did the computer go to therapy? It had too many bytes!",
    "I'm on a seafood diet. I see food and I eat it."
  ];
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  await sock.sendMessage(from, { text: `😂 ${joke}` });
}

if (body === "!motivate") {
  const quotes = [
    "Dream big and dare to fail.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Push yourself, because no one else is going to do it for you."
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  await sock.sendMessage(from, { text: `🌟 ${quote}` });
}

if (body === "!owner") {
  await sock.sendMessage(from, { text: `👤 Bot Owner: wa.me/255760317060` });
                            }
     if (body.startsWith("!scrape")) {
      try {
        const targetUrl = body.split(" ")[1];
        const res = await axios.get(targetUrl);
        const $ = cheerio.load(res.data);
        const title = $("title").text();
        await sock.sendMessage(from, { text: `✅ Title: *${title}*` });
      } catch (err) {
        await sock.sendMessage(from, { text: `❌ Error: ${err.message}` });
      }
    }
  });
}

startBot();


             
