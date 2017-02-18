// telegram-bot.js
const Telebot = require('telebot');
const apiKey = require('../keys/telegram-key.js');
const toValyrian = require('./valyrian-translator.js');


const bot = new Telebot({
  token: apiKey,
  polling: {
      interval: 1000,
      timeout: 0,
      limit: 100,
      retryTimeout: 5000
  }
});

bot.on('inlineQuery', msg => {
  const query = msg.query;
  const answers = bot.answerList(msg.id, {cacheTime: 60});
  const traduction = toValyrian(query);
  answers.addArticle({
    id: 'query',
    title: 'Valyrian traduction',
    description: traduction,
    message_text: traduction
  });
  return bot.answerQuery(answers);
})

bot.on('text', msg => {
  if (msg.text.indexOf('/') === 0) return;
  const traduction = toValyrian(msg.text);
  bot.sendMessage(msg.chat.id, traduction);
  return bot.sendSticker(msg.chat.id, 'CAADAgADLgADc5wpBNhjnuZAoYNTAg');
});

bot.on('/about', msg => {
  const text = "I've been developed by @adriangm and you can "+
  "find my code on: https://github.com/agm-dev/telegram-bot-valyriantranslator";
  return bot.sendMessage(msg.chat.id, text);
});

bot.on([
  'audio',
  'voice',
  'document',
  'photo',
  'sticker',
  'video',
  'contact',
  'location'
], msg => {
  bot.sendMessage(msg.chat.id, 'Ni piídi tridicir isi');
  return bot.sendSticker(msg.chat.id, 'CAADAgADLgADc5wpBNhjnuZAoYNTAg');
});

bot.on('/ping', msg => {
  const chatId = msg.chat.id;
  return bot.sendMessage(chatId, 'pong');
});

bot.on('connect', () => {
    console.log('Bot is connected and runing...');
});

bot.on('disconnect', () => {
    console.log('Bot has been disconnected.');
});

bot.on('update', () => {
    console.log('Bot has asked for updates.');
});

module.exports = bot;