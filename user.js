var Discord = require("discord.js");
var Role = require("./role");
var server = require("./server");

var User = {};

User.hasLevelRole = (user) => {
    return User.hasRole(user, Role.studentRoles);
}


User.hasStudentRole = (user) => {

}

User.hasNativeRole = (user) => {

}

User.hasModRole = (user) => {
    return user.roles.exists('id', server.admin);
}

User.hasLanguageRole = (user) => {
    return User.hasRole(user, Role.languages);
}

User.hasCountryRole = (user) => {
    return User.hasRole(user, Role.countries);
}

// checks if user has level, country, and native language roles
User.hasProperRoles = (user) => {
    return User.hasLevelRole(user) &&
        (User.hasLanguageRole(user) || User.hasRole(user, ['SANS LANGUE'])) &&
        (User.hasCountryRole(user) || User.hasRole(user, ['SANS PAYS']));
}

User.hasRole = (user, roles) => {
    for (let i = 0, len = roles.length; i < len; i++) {
        if (user.roles.exists('name', roles[i])) {
            return true;
        }
    }

    return false;
}

module.exports = User;
