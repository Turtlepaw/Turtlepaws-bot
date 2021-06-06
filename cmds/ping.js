const Discord = require("discord.js");
module.exports = {
 name: "ping",
 category: 'Info',
 category: "info",
 description: "Returns latency and API ping",
 async execute(message, Member, args) {
   message.channel.send(`🏓 Pinging....`).then((msg) => {
     const _ = new Discord.MessageEmbed()
       .setTitle("Pong!")
       .setDescription(
         `🏓 Pong!\nLatency is ${Math.floor(
           msg.createdTimestamp - message.createdTimestamp
         )}ms\nAPI Latency is ${Math.round(message.client.ws.ping)}ms`
       )
       .setColor("RANDOM");
     msg.edit(_);
     msg.edit("\u200B");
   });
 },
};