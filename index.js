const mineflayer = require('mineflayer');
const express = require('express');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 10000;  // Render يستخدم هذا الـ port

const host = 'mhamad09578.aternos.me';  // ← غيّر هنا بـ IP السيرفر بالضبط
const port = 58650;

const botNames = ['SmartBot1', 'SmartBot2'];
let currentBotIndex = 0;
let currentBot = null;

// Express server عشان Render يعتبره Web Service
app.get('/', (req, res) => res.send('Bots are running 24/7! 🚀'));
app.get('/ping', (req, res) => res.send('pong'));  // للـ keep-alive

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// Keep-alive داخلي (يصحي نفسه كل 10 دقايق)
setInterval(() => {
  http.get(`http://localhost:${PORT}/ping`, (res) => {
    console.log('Self-ping sent - bots stay awake');
  }).on('error', (err) => console.log('Self-ping error:', err.message));
}, 600000);  // كل 10 دقايق

function createBot(name) {
  const bot = mineflayer.createBot({
    host: host,
    port: port,
    username: name,
    version: false,
    auth: 'offline'
  });

  bot.once('spawn', () => {
    console.log(`${name} دخل! الحركة بدأت...`);
    bot.chat('بوت 24/7 على Render شغال! 🚀');

    setInterval(() => {
      if (Math.random() > 0.3) {
        bot.setControlState('forward', true);
        setTimeout(() => bot.setControlState('forward', false), 2000);
      }
      if (Math.random() > 0.5) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 600);
      }
      bot.look(Math.random() * Math.PI * 2, Math.random() * 0.5, false);
      if (Math.random() > 0.7) bot.activateItem();
    }, 4000);
  });

  bot.on('end', () => console.log(`${name} خرج!`));
  bot.on('error', (err) => console.log('خطأ:', err.message));
  bot.on('kicked', (reason) => console.log('طرد:', reason));

  return bot;
}

function switchBots() {
  const wait = 420000 + Math.random() * 420000;  // 7-14 دقيقة
  setTimeout(() => {
    if (currentBot) currentBot.quit();
    currentBotIndex = 1 - currentBotIndex;
    currentBot = createBot(botNames[currentBotIndex]);
    switchBots();
  }, wait);
}

// ابدأ!
currentBot = createBot(botNames[0]);
switchBots();
console.log('البوتات جاهزة على Render! 💪');
