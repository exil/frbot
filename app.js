var Discord = require("discord.js");
var config = require('./config');
var bot = new Discord.Client();

bot.on("message", msg => {
    let prefix = '!';
    let content = msg.content;
    let user = msg.member;
    let levels = ['beginner', 'intermediate', 'advanced'];

    if(!content.startsWith(prefix)) return;

    if (content.toLowerCase().startsWith(prefix + 'level')) {
        // check if user already has one of the student roles
        // insert here

        let command = content.split(' ');
console.log(command);
        if (command.length === 2 && command[1].length && levels.includes(command[1])) {
            let level = command[1];
            // get the role, then add it
            let newRole = msg.guild.roles.find('name', level);
console.log(user);
            user.addRole(newRole).then(test => {
                console.log("accept")
                console.log(test);
            }, test => {
                console.log('reject')
                console.log(test);
            });
        }
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