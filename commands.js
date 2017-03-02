var Discord = require("discord.js");
var Role = require("./role");
var User = require("./user");
var commands = {
    prefix: '!'
}
// key = user
// array of requests
var REQUESTS = {};
var REQUEST_LIMIT = 5;
var DELAY = 3000;

// !french [beginner|intermediate|advanced|native]
commands.setFrenchLevel = (input, data) => {
    let validRoles = Role.studentRoles;
    var user = data.member;

    // empty argument
    if (!input) {
        data.channel.sendMessage('You need to enter in a role.');
        return;
    }

    let text = input.toLowerCase();

    // make sure user doesn't already have a student or native role...
    // alternatively, maybe we should remove the old role?
    if (User.hasLevelRole(user)) {
        data.channel.sendMessage('<@' + user.user.id + '>: You\'ve already been tagged with a French level...');
        return;
    }

    // find role in alt list
    let role = Role.names[text];
    let isNative = text !== 'native';

    // role isn't in the list, or it's not a valid normal user role
    if (!role || !validRoles.includes(role)) {
        data.channel.sendMessage('<@' + user.user.id + '>: That is not a valid level role. Did you misspell something?');
        return;
    }

    // get the Role object
    let newRole = data.guild.roles.find('name', role);
    let roles = [newRole];

    if (isNative) {
        roles.push(data.guild.roles.find('name', 'Étudiant'));
    }

    if (userReady(user, isNative)  && !User.hasRole(user, ['Membre Officiel'])) {
        roles.push(getAccessRole(data));
    }

    user.addRoles(roles).then(response => {
        data.channel.sendMessage('<@' + user.user.id + '>: You\'ve been tagged with `' + role + '`.');
    }, err => {
console.log(err);
        data.channel.sendMessage('Something went wrong...');
    });
};

// !language [language]
commands.setNativeLanguage = (input, data) => {
    let validRoles = Role.languages;
    let user = data.member;
    let noRole = Role.NO_LANGUAGE;

    // empty argument
    if (!input) {
        data.channel.sendMessage('<@' + user.user.id + '>: You need to enter in a role.');
        return;
    }

    let text = input.toLowerCase();

    // find role in alt list
    var role = Role.names[text];

    // check alt list
    if (!role) {
        role = Role.alts[text];
    }

    // role isn't in the list, or it's not a valid language role
    if (!role || !validRoles.includes(role)) {
        data.channel.sendMessage('<@' + user.user.id + '>: I don\'t recognize that language. I\'ve put in a request to add it.');
        role = noRole;
        requestTag(input, data, 'language');
    }

    let isFrench = text === 'french';

	if (isFrench) {
		role = Role.names.native;
	}

    // get the Role object
    let newRole = data.guild.roles.find('name', role);
    let roles = [newRole];

    if (userReady(user, isFrench) && !User.hasRole(user, ['Membre Officiel'])) {
        roles.push(getAccessRole(data));
    }

    user.addRoles(roles).then(response => {
        if (role !== noRole) {
            data.channel.sendMessage('<@' + user.user.id + '>: You\'ve been tagged with `' + role + '`.');

            if (User.hasRole(user, [noRole])) {
                let roleToRemove = data.guild.roles.find('name', noRole);

                setTimeout(() => {
                    user.removeRole(roleToRemove).then((info) => {
                    }, err => {
                        console.log('Error trying to remove SANS PAYS role:' + err);
                    });
                }, DELAY);
            }
        }
    }, err => {
console.log(err);
        data.channel.sendMessage('Something went wrong...');
    });
};

// !origin [country]
commands.setCountry = (input, data) => {
    let validRoles = Role.countries;
    let user = data.member;
    let noRole = Role.NO_COUNTRY;

    // empty argument
    if (!input) {
        data.channel.sendMessage('<@' + user.user.id + '>: You need to enter in a role.');
        return;
    }

    let text = input.toLowerCase();

    // make sure user doesn't already have a country role...
    // alternatively, maybe we should remove the old role?
    if (User.hasCountryRole(user)) {
        data.channel.sendMessage('<@' + user.user.id + '>: You\'ve already been tagged with a country.');
        return;
    }

    // find role in alt list
    var role = Role.names[text];
    // check alt list
    if (!role) {
        role = Role.alts[text];
    }

    // role isn't in the list, or it's not a valid country role
    if (!role || !validRoles.includes(role)) {
        data.channel.sendMessage('<@' + user.user.id + '>: I don\'t recognize that country. I\'ve put in a request to add it.');
        requestTag(input, data, 'country');
        role = noRole;
    }

    // get the Role object
    let newRole = data.guild.roles.find('name', role);
    let roles = [newRole];
    
	if (userReady(user) && !User.hasRole(user, ['Membre Officiel'])) {
        roles.push(getAccessRole(data));
    }
    
	user.addRoles(roles).then(response => {
		if (role !== noRole) {
            data.channel.sendMessage('<@' + user.user.id + '>: You\'ve been tagged with `' + role + '`.');

                if (User.hasRole(user, [noRole])) {
                    let roleToRemove = data.guild.roles.find('name', noRole);


                    setTimeout(() => {
                        user.removeRole(roleToRemove).then((info) => {
                        }, err => {
                            console.log('Error trying to remove SANS PAYS role:' + err);
                        });
                    }, DELAY);
                }
        }
    }, err => {
		console.log(err);
        data.channel.sendMessage('Something went wrong...');
    });
};

commands.getList = (input, data) => {
    if (input === 'countries') {
        data.channel.sendMessage('```' + prettyPrint(Role.countriesFriendly) + '```');
    } else if (input === 'languages') {
        data.channel.sendMessage('```' + prettyPrint(Role.languagesFriendly) + '```');
    }
};

commands.loadRoles = (data) => {
    if (!User.hasModRole(data.member)) return;

    for (var i = 0; i < Role.languages.length; i++) {
	if (!data.guild.roles.find('name', Role.languages[i])) {
	  data.guild.createRole({ name: Role.languages[i] })
          .then(role => console.log(`Created role ${role}`))
          .catch(console.error)
	}
    }

    for (var i = 0; i < Role.countries.length; i++) {
        if (!data.guild.roles.find('name', Role.countries[i])) {
          data.guild.createRole({ name: Role.countries[i] })
          .then(role => console.log(`Created role ${role}`))
          .catch(console.error)
        }
    }
};

commands.addSuggestion = (input, data, bot) => {
	let suggestions = bot.channels.find('name', 'bot');
	let user = data.author;
	
	user.sendMessage('Thank you for your suggestion. Your suggestion will be considered by the mod team.')
 		.then(message => console.log(`Sent message: ${message.content}`))
 		.catch(console.error);

    suggestions.sendMessage('Suggestion by <@' + user.id + '>: `' + input + '`');
};

commands.warnSuggestion = (input, data) => {
	let user = data.member.user;

	data.channel.sendMessage('<@' + user.id + '>: Please check your private messages for more information on making suggestions.');

	user.sendMessage('To make a suggestion, please reply to this message using the following command:```!suggest yoursuggestionhere```')
 		.then(message => console.log(`Sent message: ${message.content}`))
 		.catch(console.error);
};

commands.dmSent = (input, data, bot) => {
	let suggestions = bot.channels.find('name', 'bot');
	let user = data.author;

	suggestions.sendMessage('New message to Nostradamus by <@' + user.id + '>: `' + input + '`');
}

commands.addNewRole = (english, french, type, data) => {
	// add role, then add it to database
	// data.guild.channels.find('name', 'bot');
	var channel = data.channel;

	if (data.channel.id === '254540604908896256') {
		if (!data.guild.roles.find('name', french)) {
			data.guild.createRole({ name: french })
			.then(role => {
				data.channel.sendMessage('Added new role: ' + french);
				console.log(`Created role ${role}`)
			})
            .catch(console.error);

			// then add to database
			Role.add(english, french, type);
		}
	}
};

commands.tagUser = (input, data) => {
    let userId = data.mentions.users.first();

    data.guild.fetchMember(userId).then((user) => {
        if (!user) return;

        let text = input.toLowerCase();
        let role = Role.names[text];

        if (!role) return;

        let newRole = data.guild.roles.find('name', role);
        let noRole = Role.isCountryRole(role) ? Role.NO_COUNTRY : Role.NO_LANGUAGE;

        setTimeout(function() {
            user.addRole(newRole).then(response => {
                data.channel.sendMessage(userId + ': You\'ve been tagged with `' + role + '`.');

                if (User.hasRole(user, [noRole])) {
                    let roleToRemove = data.guild.roles.find('name', noRole);

                    setTimeout(() => {
                        user.removeRole(roleToRemove).then((info) => {

                            //userReady(user, data);
                        }, err => {
                            console.log('Error trying to remove SANS PAYS role:' + err);
                        });
                    }, DELAY);
                }

                //userReady(user, data);
            }, err => {
console.log(err);
                data.channel.sendMessage('Something went wrong...');
            });
        }, DELAY);

        return;
    }, err => {
        console.log('User didn\'t have "New" role to begin with?:' + err);
    });
};

var requestTag = (input, data, type) => {
    let text = input.toLowerCase();
    let user = data.member.user;
    let id = user.id;
    var hasDuplicate = false;

    if (!REQUESTS.id) {
        REQUESTS.id = [];
    }

    if (REQUESTS.id.includes(text)) {
        hasDuplicate = true;
    }

    REQUESTS.id.push(text);

    // don't let the user request more than 3 times
    if (REQUESTS.id.length <= REQUEST_LIMIT && !hasDuplicate) {
        let suggestions = data.guild.channels.find('name', 'bot');
        suggestions.sendMessage(type + ' tag request by <@' + user.id + '>: `' + text + '`');
    }
};

// checks to see if user has all the proper roles to see all the chats
// if this function is called and they have already 2 out of the 3 tags,
// this means a third role is about to be added and therefore they
// are granted access
var userReady = (user) => {
    return User.getProperRoleCount(user) >= 2;
};

// get access role
var getAccessRole = (data) => {
    return data.guild.roles.find('name', 'Membre Officiel');
};


var prettyPrint = (arr) => {
    if (!arr) return;

    var longestLength = arr.reduce(function (a, b) { return a.length > b.length ? a : b; }).length;

    var prettyArr = arr.map(function(str) {
        var spacesToAdd = longestLength - str.length;

        return str.replace(' ', '\xa0') + ' '.repeat(spacesToAdd);
    });

    return prettyArr.join(' ');
};

// removes sans pays/sans langue role. make this more generic
// var removeRole = (data, role) => {
//     let roleToRemove = data.guild.roles.find('name', role);

//     setTimeout(() => {
//         data.member.removeRole(roleToRemove).then((info) => {
//             checkIfReady(user, data);
//         }, err => {
//             console.log('Error trying to remove SANS PAYS role:' + err);
//         });
//     }, 200);
// };

// clear the requests array every hour
setInterval(function() {
    REQUESTS = {};
    console.log('Tag request queue cleared.');
}, 3600000);

module.exports = commands;
