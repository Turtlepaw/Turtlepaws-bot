const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const klawSync = require('klaw-sync')
const mongoose = require('mongoose');


mongoose.connect(config.mongoose, { useNewUrlParser: true, useUnifiedTopology: true })

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_INTEGRATIONS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"],


    presence: {
        status: 'online',
        activities: [{ name: `Helping Turtlepaw`, type: 'PLAYING' }],
    }
});

client.once('ready', async () => {
    console.log('Ready!');
});

client.commands = new Discord.Collection();
client.slashcmds = new Discord.Collection();
client.config = config;
//client.disbut = require('discord-buttons')(client);

const slashFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));

// Here we load all the commands into client.commands
for (const file of slashFiles) {
    const command = require(`./slash/${file}`);
    console.log(`loading slash/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.slashcmds.set(command.name, command);
}
const errorr = new Discord.MessageEmbed()
    .setTitle(`That's a 404`)
    .setColor(`YELLOW`)
    .setDescription(`This is a problem at our end we are clearing it up, please try again in a bit if it still does not work use ,problem`)
    .setImage(`https://cdn.tixte.com/uploads/turtlepaw.is-from.space/kow11oq1p9a.png`)
client.on('interaction', async interaction => {
    if (!interaction.isCommand()) return;
    console.log(`received interaction ${interaction.commandName} by ${interaction.user.tag}`);
    const commandName = interaction.commandName;

    const command = client.slashcmds.get(commandName);
    if (!command) {
        // interaction.reply(`Sorry i don't think /${commandName} is possible ${opps}`);
    }
    else {
        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            // interaction.reply(`Something went very wrong ${opps}`);
        }
    }
});
// const emojiRegex = require('emoji-regex/RGI_Emoji.js');
const emojii = require('./models/emojis')
// EMOJI STUFF
//Already on turtlebot =>
// client.on('message', async message => {
//     const hasEmoteRegex = /<a?:.+:\d+>/gm
//     const emoteRegex = /<:.+:(\d+)>/gm
//     const animatedEmoteRegex = /<a:.+:(\d+)>/gm
  
//     const messages = await message.channel.messages.fetch()
//     //const message = await messages.find(m => m.content.match(hasEmoteRegex))
//   //emoji = 
//     if (emoji = emoteRegex.exec(message) || animatedEmoteRegex.exec(message)) {
//     let messageUser = await emojii.findOne({
//         emoji: emoji[0]
//     });

//     if (!messageUser) {
//         messageUser = new emojii({
//             emoji: emoji[0],
//             user: message.author.id,
//             guild: message.guild.id,
//             uses: 0
//         });
//         await messageUser.save().catch(e => console.log(e));
//     };

//     await emojii.findOne({
//         emoji: emoji[0]
//     }, async (err, dUser) => {
//         if (err) console.log(err);
//         dUser.uses += 1;
//         await dUser.save().catch(e => console.log(e));
//     });
//     console.log(`Added ${emoji[0]}`)
//     }
// });
//
//END
client.on("message", message => {
    const args = message.content.split(" ").slice(1);
    const clean = text => {
        if (typeof (text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
    if (message.content.startsWith(config.prefix + "eval")) {
        if (message.author.id !== config.ownerID) return;
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled), { code: "xl" });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
});
var commandFiles = klawSync('./cmds', { nodir: true, traverseAll: true, filter: f => f.path.endsWith('.js') })
for (const file of commandFiles) {
    const command = require(`${file.path}`);
    console.log(`loading ${command.category}/${command.name}: ${file.path}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
client.on('message', async message => {
    const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}>`);
    // if (!prefixRegex.test(message.content)) return;
    if (message.content.match(mentionRegex)) {
        let currentPrefix = config.prefix;
            message.reply(
                new Discord.MessageEmbed()
                    .setTitle(`Hey there!`)
                    .setDescription(`My prefix is \`${config.prefix}\``)
                    .setColor('BLUE')
            )
    }
});
client.queue = new Map();
client.on('message', async message => {
    var Member;
    var differentDays = 0;
    if (message.mentions.members) {
        Member = message.mentions.members.first()
        if (!Member) {
            Member = message.member
        }
    }

    if (Member) {
        var joinedSince = new Date() - Member.joinedAt
        differentDays = Math.round(joinedSince / (1000 * 3600 * 24));
    }
    message.differentDays = differentDays;
    message.client = client;
    if (message.author.bot) {
        return
    }
    if (message.content.startsWith(config.prefix) && !message.author.bot) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        const cat = client.emojis.cache.find(em => em.name === "cat1");
        if (!command) {
            //message.reply(`That's not a command ${cat}`);
        }
        else {
            try {
                command.execute(message, Member, args);
            } catch (error) {
                console.error("Yikes!!");
                console.error(error);
                const x = client.emojis.cache.find(em => em.name === "X1");
                message.reply(errorr);
            }
        }
    }
});
client.login(config.token);