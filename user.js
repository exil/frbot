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

// checks if user has level, country, and native language roles
// if user is native, subtract one since they get 2 points
// after tagging language OR level of french
User.getProperRoleCount = (user, isNative) => {
    var penalty = isNative ? 1 : 0;
    return Number(User.hasLevelRole(user)) +
        Number((User.hasLanguageRole(user) || User.hasRole(user, ['SANS LANGUE']))) +
        ((User.hasCountryRole(user) || User.hasRole(user, ['SANS PAYS']))) - penalty;
}

User.hasRole = (user, roles) => {
    if (!user) return false;

    for (let i = 0, len = roles.length; i < len; i++) {
        if (user.roles.exists('name', roles[i])) {
            return true;
        }
    }

    return false;
}

module.exports = User;
