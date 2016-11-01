var Discord = require("discord.js");
var config = require('./config');
var commands = require('./commands');

var bot = new Discord.Client();

bot.on("message", msg => {
    let prefix = commands.prefix;
    let content = msg.content;

    if(!content.startsWith(prefix)) return;

    if (content.toLowerCase().startsWith(prefix + 'level')) {
        let command = content.split(' ');
        commands.newUser(command, msg);
    }

    return;
});

bot.on("guildMemberAdd", (member) => {
    //console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    //member.guild.defaultChannel.sendMessage(`"${member.user.username}" has joined this server`);
});

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.login(config.BOT_TOKEN);