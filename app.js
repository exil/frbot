var Discord = require("discord.js");
var config = require('./config');
var commands = require('./commands');
var ADMIN_MODE = 0;


var bot = new Discord.Client();

bot.on("message", msg => {
    if(msg.author.bot) return;

    if (ADMIN_MODE && !msg.member.user.roles.exists('id', '242563745556070400')) return;

    let prefix = commands.prefix;
    let content = msg.content;

    if(!content.startsWith(prefix)) return;

    let command = content.toLowerCase();
    let commandArgs = command.split(' ');

    if (!command) return;

    // for single argument commands, only allow one space.
    // if more than one space, assume argument is multi-word
    var arg = commandArgs.slice(1).join(' ');

    if (arg.startsWith('[') && arg.endsWith(']')) {
        arg = arg.slice(1, -1);
    }

    if (command.startsWith(prefix + 'french') || command.startsWith(prefix + 'level')) {
        commands.setFrenchLevel(arg, msg);
    } else if (command.startsWith(prefix + 'language') || command.startsWith(prefix + 'native')) {
        commands.setNativeLanguage(arg, msg);
    } else if (command.startsWith(prefix + 'origin') || command.startsWith(prefix + 'country')) {
        commands.setCountry(arg, msg);
    }  else if (command.startsWith(prefix + 'list')) {
        commands.getList(arg, msg);
    } else if (command.startsWith(prefix + 'remind')) {
        // todo
    } else if (command.startsWith(prefix + 'tag')) {
        // first parameter is user, second is tag name typed out

        commands.tagUser(arg, msg);
    } else if (command.startsWith(prefix + 'load')) {
        commands.loadRoles(msg);//commands.load(msg);
    }

    return;
});

bot.on("guildMemberAdd", (member) => {
    // add New role
    let newRole = member.guild.roles.find('name', 'New');

    member.addRole(newRole).then(response => {}, err => {
        console.log('New role was not added:' + err);
    });

    member.guild.defaultChannel.sendMessage(`
**Welcome to the official /r/French Discord, <@${member.user.id}>! To gain access to the chat, you must follow these instructions to set your proficiency in French, native language (if not French), and country.**\n`);
    member.guild.defaultChannel.sendMessage(`

1. Set your proficiency in French.
\`\`\`
!french [beginner|intermediate|advanced|native]
\`\`\`
2. Choose your native language (if it is French, continue to step 3.)
\`\`\`
!language [language]
\`\`\`
3. Indicate your country.
\`\`\`
!origin [country]
\`\`\`
*To get a list of countries or languages:*
\`\`\`
!list [countries|languages]
\`\`\`
*If your country or language isn't listed:*
\`\`\`
!language [other] or !country [other]
\`\`\`
        `);
});

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.login(config.BOT_TOKEN);