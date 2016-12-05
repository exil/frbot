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
var DELAY = 1000;

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
        data.channel.sendMessage('You\'ve already been tagged with a French level...');
        return;
    }

    // find role in alt list
    let role = Role.names[text];

    // role isn't in the list, or it's not a valid normal user role
    if (!role || !validRoles.includes(role)) {
        data.channel.sendMessage('That is not a valid level role. Did you misspell something?');
        return;
    }

    // get the Role object
    let newRole = data.guild.roles.find('name', role);
    user.addRole(newRole).then(response => {
        data.channel.sendMessage('You\'ve been tagged with `' + role + '`.');
        // also add the étudiant role if they're not a french native
        if (text !== 'native') {
            let studentRole = data.guild.roles.find('name', 'Étudiant');

            user.addRole(studentRole).then(response => {}, err => {
                data.channel.sendMessage('Something went wrong...');
            });
        }

        checkIfReady(user, data);
    }, err => {
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
        data.channel.sendMessage('You need to enter in a role.');
        return;
    }

    let text = input.toLowerCase();

    // find role in alt list
    var role = Role.names[text];

    // role isn't in the list, or it's not a valid language role
    if (!role || !validRoles.includes(role)) {
        data.channel.sendMessage('I don\'t recognize that language. I\'ve put in a request to add it.');
        role = noRole;
        requestTag(input, data, 'language');
    }

	if (text === 'french') {
		role = Role.names.native;
	}

    // get the Role object
    let newRole = data.guild.roles.find('name', role);

    data.member.addRole(newRole).then(response => {
        if (role !== noRole) {
            data.channel.sendMessage('You\'ve been tagged with `' + role + '`.');

            if (User.hasRole(user, [noRole])) {
                let roleToRemove = data.guild.roles.find('name', noRole);

                setTimeout(() => {
                    user.removeRole(roleToRemove).then((info) => {
                        checkIfReady(user, data);
                    }, err => {
                        console.log('Error trying to remove SANS PAYS role:' + err);
                    });
                }, DELAY);
            }
        }

        checkIfReady(user, data);
    }, err => {
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
        data.channel.sendMessage('You need to enter in a role.');
        return;
    }

    let text = input.toLowerCase();

    // make sure user doesn't already have a country role...
    // alternatively, maybe we should remove the old role?
    if (User.hasCountryRole(user)) {
        data.channel.sendMessage('You\'ve already been tagged with a country.');
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
        data.channel.sendMessage('I don\'t recognize that country. I\'ve put in a request to add it.');
        requestTag(input, data, 'country');
        role = noRole;
    }

    // get the Role object
    let newRole = data.guild.roles.find('name', role);

    user.addRole(newRole).then(response => {
        if (role !== noRole) {
            data.channel.sendMessage('You\'ve been tagged with `' + role + '`.');

                if (User.hasRole(user, [noRole])) {
                    let roleToRemove = data.guild.roles.find('name', noRole);

                    setTimeout(() => {
                        user.removeRole(roleToRemove).then((info) => {

                            checkIfReady(user, data);
                        }, err => {
                            console.log('Error trying to remove SANS PAYS role:' + err);
                        });
                    }, DELAY);
                }
        }
console.log('checking if ready');
        checkIfReady(user, data);
    }, err => {
        data.channel.sendMessage('Something went wrong...');
    });
};

commands.getList = (input, data) => {
    if (input === 'countries') {
        data.channel.sendMessage('```' + Role.countriesFriendly.join('\n') + '```');
    } else if (input === 'languages') {
        data.channel.sendMessage('```' + Role.languagesFriendly.join('\n') + '```');
    }
};

commands.loadRoles = (data) => {
    if (!User.hasModRole(data.member)) return;

    for (var i = 0; i < Role.languages.length; i++) {
        data.guild.createRole({ name: Role.languages[i] })
          .then(role => console.log(`Created role ${role}`))
          .catch(console.error)
    }

    for (var i = 0; i < Role.countries.length; i++) {
        data.guild.createRole({ name: Role.countries[i] })
          .then(role => console.log(`Created role ${role}`))
          .catch(console.error)
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

                            checkIfReady(user, data);
                        }, err => {
                            console.log('Error trying to remove SANS PAYS role:' + err);
                        });
                    }, DELAY);
                }

                checkIfReady(user, data);
            }, err => {
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
        let suggestions = data.guild.channels.find('name', 'server_log');
        suggestions.sendMessage(type + ' tag request by <@' + user.id + '>: `' + text + '`');
    }
};

// checks to see if user has all the proper roles to see all the chats
var checkIfReady = (user, data) => {
	if (User.hasProperRoles(user)) {
        let role = data.guild.roles.find('name', 'Membre Officiel');

        setTimeout(function() {
            user.addRole(role).then(() => {}, err => {
                console.log('Didn\'t add membre role sucucssfully.:' + err);
            });
        }, 0)
    }
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
