var Discord = require("discord.js");
var Role = require("./role");
var User = require("./user");
var commands = {
    prefix: '!'
}

// !french [beginner|intermediate|advanced|native]
commands.setFrenchLevel = (input, data) => {
    let validRoles = Role.normalUserRoles;
    let user = data.member;

    console.log(Role);

    // empty argument
    if (!input) {
        data.channel.sendMessage('You need to enter in a role.');
        return;
    }

    let text = input.toLowerCase();

    // make sure user doesn't already have a student or native role...
    // alternatively, maybe we should remove the old role?
    if (User.hasNormalUserRole(user)) {
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


    user.addRole(newRole).then(test => {
        data.channel.sendMessage('You\'ve been tagged with `' + role + '`.');
    }, test => {
        data.channel.sendMessage('Something went wrong...');
    });
}

// !language [language]
commands.setNativeLanguage = (input, data) => {
    let validRoles = Role.languages;
    let user = data.member;

    // empty argument
    if (!input) {
        data.channel.sendMessage('You need to enter in a role.');
        return;
    }

    let text = input.toLowerCase();

    // find role in alt list
    let role = Role.names[text];

    // role isn't in the list, or it's not a valid language role
    if (!role || !validRoles.includes(role)) {
        data.channel.sendMessage('I don\'t recognize that language. I\'ve put in a request to add it.');
        requestTag(input, data);
        return;
    }

    // get the Role object
    let newRole = data.guild.roles.find('name', role);

    data.member.addRole(newRole).then(test => {
        data.channel.sendMessage('You\'ve been tagged with `' + role + '`.');
    }, test => {
        data.channel.sendMessage('Something went wrong...');
    });
}

// !origin [country]
commands.setCountry = (input, data) => {
    let validRoles = Role.countries;
    let user = data.member;

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
    let role = Role.names[text];

    // role isn't in the list, or it's not a valid country role
    if (!role || !validRoles.includes(role)) {
        data.channel.sendMessage('I don\'t recognize that country. I\'ve put in a request to add it.');
        requestTag(input, data);
        return;
    }

    // get the Role object
    let newRole = data.guild.roles.find('name', role);

    data.member.addRole(newRole).then(test => {
        data.channel.sendMessage('You\'ve been tagged with `' + role + '`.');
    }, test => {
        data.channel.sendMessage('Something went wrong...');
    });
}

commands.getList = (input, data) => {

}

requestTag = (input, data) => {
    let text = input.toLowerCase();
    let user = data.member.user;

    let suggestions = data.guild.channels.find('name', 'suggestions');

    suggestions.sendMessage('Tag Suggestion by <@' + user.id + '>: `' + text + '`');
}

module.exports = commands;