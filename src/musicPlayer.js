const ytdl = require('ytdl-core');

const musicQueue = new Map();

const victoryFanfare = "https://www.youtube.com/watch?v=-YCN-a0NsNk"

exports.execute = async function(message) {
  //const args = message.contents.split(" ");
  let serverQueue = musicQueue.get(message.guild.id);
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return message.channel.send("You need to be in a voice channel to use fanfare!");
  }
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }
  //const songInfo = await ytdl.getInfo(args[1]);
  const songInfo = await ytdl.getInfo(victoryFanfare)
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url
  }

  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 3,
      playing: true
    }
    musicQueue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);
    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(message.guild, queueConstruct.songs[0]);
    } catch (err) {
      console.log(err);
      queueConstruct.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(`Queueing up: **${song.title}**, there are ${serverQueue.songs.length - 1} other songs in the queue`)
  }
}

function play(guild, song) {
  const serverQueue = musicQueue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    musicQueue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

exports.stop = function (message) {
  let serverQueue = musicQueue.get(message.guild.id);
  if (!message.member.voice.channel) {
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  }
  if (serverQueue) {
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }
}

