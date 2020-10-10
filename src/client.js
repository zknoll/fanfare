"use strict";

const Discord = require('discord.js');
const { prefix, token } = require("../config/config.json");
const { explainTeaser, helpMessage } = require("./data.json")
const musicPlayer = require('./musicPlayer')
const client = new Discord.Client();


exports.init = function() {
  client.login(token);
  client.once('ready', onReady);
  client.once('reconnect', onReconnect);
  client.once('disconnect', onDisconnect);
  client.on('message', onMessage);
}

function onReady() {
  console.log('Ready!');
};

function onReconnect() {
  console.log('Reconnecting!');
};

function onDisconnect() {
  console.log('Disconnect!');
};

async function onMessage(message) {
  console.log(message.content);
  // Return if the message was from us
  if (message.author.bot) return;

  // If the message doesn't start with our prefix, also return
  if (!message.content.startsWith(prefix)) return;

  if (isMessage(message, "play")) {
    // play fanfare here
    musicPlayer.execute(message);
  } else if (isMessage(message, "stop")) { 
    message.channel.send("Ok!")
    musicPlayer.stop(message)
  } else if (isMessage(message, "explain")) {
    message.channel.send(explainTeaser)
  } else if (isMessage(message, "help")) {
    message.channel.send(helpMessage)
  } else {
    message.channel.send("Sorry!  I didn't understand that!");
  }

}

function isMessage(message, command) {
  return message.content.startsWith(`${prefix}${command}`)
}