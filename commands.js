var Discord = require("discord.js");
var Role = require("./role");
var User = require("./user");
var commands = {
    prefix: '!'
}

commands.newUser = (input, data) => {
    let validRoles = Role.normalUserRoles;

    // empty argument
    if (!input) {
        data.guild.defaultChannel.sendMessage('That is not a valid role. Did you misspell something?');
        return;
    }

    // make sure user doesn't already have a student or native role...
    // alternatively, maybe we should remove the old role?
    if (Role.hasNormalUserRole(data.member)) {
        data.guild.defaultChannel.sendMessage('You\'ve already been tagged...');
        return;
    }

    // find role in alt list
    let role = Role.alts[input];

    // role isn't in the list, or it's not a valid normal user role
    if (!role || !validRoles.includes(role)) {
        data.guild.defaultChannel.sendMessage(`That is not a valid role. Did you misspell something?`);
        return;
    }

    // get the Role object
    let newRole = data.guild.roles.find('name', role);

    data.member.addRole(newRole).then(test => {
        data.guild.defaultChannel.sendMessage('Role added!');
    }, test => {
        data.guild.defaultChannel.sendMessage('Something went wrong...');
    });
}