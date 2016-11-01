var Discord = require("discord.js");
var config = require('./config');
var commands = require('./commands');

var bot = new Discord.Client();

bot.on("message", msg => {
    if(msg.author.bot) return;

    let prefix = commands.prefix;
    let content = msg.content;

    if(!content.startsWith(prefix)) return;

console.log(content);
    let command = content.split(' ');

    if (!command) return;

    if (content.toLowerCase().startsWith(prefix + 'level')) {
        commands.setFrenchLevel(command[1], msg);
    } else if (content.toLowerCase().startsWith(prefix + 'native')) {
        commands.setNativeLanguage(command[1], msg);
    } else if (content.toLowerCase().startsWith(prefix + 'country')) {
        commands.setCountry(command[1], msg);
    } else if (content.toLowerCase().startsWith(prefix + 'request')) {
        commands.requestTag(command[1], msg);
    } else if (content.toLowerCase().startsWith(prefix + 'remind')) {
        // todo
    } else if (content.toLowerCase().startsWith(prefix + 'tag')) {
        // todo (admin only)
    }

    return;
});

bot.on("guildMemberAdd", (member) => {
    //console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
    member.guild.defaultChannel.sendMessage('Bienvenue ' + member.user.username + '! Please answer a few questions. Use the `!level [beginner|intermediate|advanced|native]` command to indicate your level in French. Example: `!level native`');
});

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.login(config.BOT_TOKEN);