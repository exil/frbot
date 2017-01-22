var Discord = require("discord.js");
var config = require('./config');
var commands = require('./commands');
var User = require('./user');
var Role = require('./role');

var bot = new Discord.Client();

bot.on("message", msg => {
    if(msg.author.bot) return;


    //if (ADMIN_MODE && !msg.member.user.roles.exists('id', '242563745556070400')) return;

    let prefix = commands.prefix;
    let content = msg.content;

	if (msg.channel.type === 'dm') {
        if (!content.startsWith(prefix)) {
            commands.dmSent(content, msg, bot);
        	return;
		}
    }

    if(!content.startsWith(prefix)) return;

    let command = content.toLowerCase();
    let commandArgs = command.split(' ');

    if (!command) return;

    // for single argument commands, only allow one space.
    // if more than one space, assume argument is multi-word
    var arg = commandArgs.slice(1).join(' ');

    // in case user puts []'s around the tag
    if (arg.startsWith('[') && arg.endsWith(']')) {
        arg = arg.slice(1, -1);
    }

    arg = arg.trim();

	if (msg.channel.type === 'dm') {
		if (command.startsWith(prefix + 'suggest')) {
			commands.addSuggestion(arg, msg, bot);
		}

		return;
	}

	if (command.startsWith(prefix + 'french') || command.startsWith(prefix + 'level')) {
		commands.setFrenchLevel(arg, msg);
	} else if (command.startsWith(prefix + 'language') || command.startsWith(prefix + 'native')) {
		commands.setNativeLanguage(arg, msg);
	} else if (command.startsWith(prefix + 'origin') || command.startsWith(prefix + 'country')) {
		commands.setCountry(arg, msg);
	}  else if (command.startsWith(prefix + 'list')) {
		commands.getList(arg, msg);
	} else if (command.startsWith(prefix + 'suggest')) {
		commands.warnSuggestion(arg, msg);
	} else if (command.startsWith(prefix + 'remind')) {
		// todo
	} else if (command.startsWith(prefix + 'tag')) {
		// for admins only:
		if (User.hasModRole(msg.member) && msg.mentions) {
			arg = commandArgs.slice(1, -1).join(' ');
			commands.tagUser(arg, msg);
		}
	} else if (command.startsWith(prefix + 'help')) {
		msg.channel.sendMessage(`
\`\`\`
!french [beginner|intermediate|advanced|native]
!language [language]
!country [country]
!list [countries|languages]
\`\`\`
		`);
	}

    // admin only

	// case sensitive
    let commandArgsCS = content.split(' ');

    var argCS = commandArgsCS.slice(1).join(' ');
    if (User.hasModRole(msg.member)) {
    	var terms = argCS.split('|');
		var english = terms[0];
		var french = terms[1];
		if (command.startsWith(prefix + 'addlanguage')) {
			commands.addNewRole(english, french, 'languages', msg);
		} else if (command.startsWith(prefix + 'addcountry')) {
			commands.addNewRole(english, french, 'countries', msg);
		}

	/*    if (command.startsWith(prefix + 'grabthestuff')) {
            // print out all the roles
            console.log(msg.guild.roles.map(function(role, index) {
                return {
                    name: role.name,
                    id: role.id,
                    color: role.color
                }
            }));
            console.log(msg.guild.channels.map(function(role, index) {
                return {
                    name: role.name,
                    id: role.id
                }
            }));
        } else if (command.startsWith(prefix + 'load')) {
			//commands.loadRoles(msg);//commands.load(msg);
		}
	*/
     }

    return;
});

bot.on("guildMemberAdd", (member) => {
    // add New role
	member.guild.defaultChannel.sendMessage(`
		**Welcome to the official /r/French Discord, <@${member.user.id}>! To gain access to the chat, please follow these instructions to set your proficiency in French, native language (if not French), and country.**\n`);
			member.guild.defaultChannel.sendMessage(`

1. Set your proficiency in French.
\`\`\`
!french [beginner|intermediate|advanced|native]
\`\`\`
2. Choose your native language (if French, skip this step.)
\`\`\`
!language [language]
\`\`\`
3. Indicate your country.
\`\`\`
!country [country]
\`\`\`
*To get a list of countries or languages:*
\`\`\`
!list [countries|languages]
\`\`\`
*If your country or language isn't listed:*
\`\`\`
!language [yourlanguagehere] or !country [yourcountryhere]
\`\`\`
`);
});

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.login(config.BOT_TOKEN.live);
