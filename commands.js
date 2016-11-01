var Discord = require("discord.js");
var Role = require("./role");
var User = require("./user");
var commands = {
    prefix: '!'
}

commands.setFrenchLevel = (input, data) => {
    console.log(data.guild.channels);
    let validRoles = Role.normalUserRoles;
    let user = data.member;

    // empty argument
    if (!input) {
        data.guild.defaultChannel.sendMessage('You need to enter in a role.');
        return;
    }

    let text = input.toLowerCase();

    // make sure user doesn't already have a student or native role...
    // alternatively, maybe we should remove the old role?
    if (User.hasNormalUserRole(user)) {
        data.guild.defaultChannel.sendMessage('You\'ve already been tagged with a French level...');
        return;
    }

    // find role in alt list
    let role = Role.alts[text];

    // role isn't in the list, or it's not a valid normal user role
    if (!role || !validRoles.includes(role)) {
        data.guild.defaultChannel.sendMessage('That is not a valid level role. Did you misspell something?');
        return;
    }

    // get the Role object
    let newRole = data.guild.roles.find('name', role);

    user.addRole(newRole).then(test => {
        data.guild.defaultChannel.sendMessage('You\'ve been tagged with `' + role + '`.');

        // bot shouldn't continue if they already have a language set

        if (role !== Role.names.NATIVE) {
            if (User.hasLanguageRole(user)) {
                return;
            }

            data.guild.defaultChannel.sendMessage('Now please tell us your native language by using the `!native [language]` command. Example: `!native English`');
        } else {
            // lets not duplicate this code...
            if (User.hasCountryRole(user)) {
                return;
            }

            data.guild.defaultChannel.sendMessage('Please tell us what country you\'re from if you wish to do so. Example: `!country Canada`');
        }

    }, test => {
        data.guild.defaultChannel.sendMessage('Something went wrong...');
    });
}

commands.setNativeLanguage = (input, data) => {
    let validRoles = Role.languages;
    let user = data.member;

    // empty argument
    if (!input) {
        data.guild.defaultChannel.sendMessage('You need to enter in a role.');
        return;
    }

    let text = input.toLowerCase();

    // find role in alt list
    let role = Role.alts[text];

    // role isn't in the list, or it's not a valid language role
    if (!role || !validRoles.includes(role)) {
        data.guild.defaultChannel.sendMessage('That is not a valid language role. Did you misspell something? If not, use the `!request [tag]` command to request a tag.');
        return;
    }

    // get the Role object
    let newRole = data.guild.roles.find('name', role);

    data.member.addRole(newRole).then(test => {
        data.guild.defaultChannel.sendMessage('You\'ve been tagged with `' + role + '`.');

        // bot shouldn't say this if they already have a country set
        if (User.hasCountryRole(user)) {
            return;
        }

        data.guild.defaultChannel.sendMessage('Please tell us what country you\'re from if you wish to do so. Example: `!country Canada`');
    }, test => {
        data.guild.defaultChannel.sendMessage('Something went wrong...');
    });
}

commands.setCountry = (input, data) => {
    let validRoles = Role.countries;
    let user = data.member;

    // empty argument
    if (!input) {
        data.guild.defaultChannel.sendMessage('You need to enter in a role.');
        return;
    }

    let text = input.toLowerCase();

    // make sure user doesn't already have a country role...
    // alternatively, maybe we should remove the old role?
    if (User.hasCountryRole(user)) {
        data.guild.defaultChannel.sendMessage('You\'ve already been tagged with a country.');
        return;
    }

    // find role in alt list
    let role = Role.alts[text];

    // role isn't in the list, or it's not a valid country role
    if (!role || !validRoles.includes(role)) {
        data.guild.defaultChannel.sendMessage('That country isn\'t in our list. Did you misspell something? If not, use the `!request [tag]` command to request a tag.');
        return;
    }

    // get the Role object
    let newRole = data.guild.roles.find('name', role);

    data.member.addRole(newRole).then(test => {
        data.guild.defaultChannel.sendMessage('You\'ve been tagged with `' + role + '`.');
    }, test => {
        data.guild.defaultChannel.sendMessage('Something went wrong...');
    });
}


commands.requestTag = (input, data) => {
    let user = data.member.user;

    console.log(user);

    // empty argument
    if (!input) {
        data.guild.defaultChannel.sendMessage('You need to enter in something.');
        return;
    }

    let text = input.toLowerCase();

    // verify if role exists
    let role = Role.alts[text];

    // role isn't in the list, or it's not a valid country role
    if (role) {
        data.guild.defaultChannel.sendMessage('Hm, it appears that that tag already exists!');
        return;
    }

    // send it to the suggestions
    let suggestions = data.guild.channels.find('name', 'suggestions');

    suggestions.sendMessage('Tag Suggestion by <@' + user.id + '>: `' + text + '`');
}

module.exports = commands;