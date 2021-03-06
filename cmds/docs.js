const Discord = require("discord.js");
const fetch = require('node-fetch')

async function fetchDocs(term) {
	const q = encodeURIComponent(term.toString());

	const res = await fetch(`https://djsdocs.sorta.moe/v1/main/master/embed?q=${q}`);
	const embed = await res.json();

	return embed; 
};

module.exports = {
 name: "docs",
 description: "Use the Discord.js docs",
 async execute(message, Member, args) {
     if(!args[0]){
         return message.reply(
             new Discord.MessageEmbed()
             .setTitle(`What do you want to search for?`)
             .setColor(`RED`)
         )
     }
    fetchDocs(`${args[0]}`).then((docr) => {
        message.reply(
            new Discord.MessageEmbed()
            .setAuthor(`${docr.author.name}`, `${docr.author.icon_url}`, `${docr.author.url}`)
            .setTitle(`Search results:`)
            .setURL(docr.url)
            .setDescription(docr.description)
            .setColor('BLUE')
            )
        console.log(docr)
    }
    )
		.catch(console.error);
 },
};