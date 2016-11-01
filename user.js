var Discord = require("discord.js");
var Role = require("./role");

var User = {};

User.hasNormalUserRole = (user) => {
    return User.hasRole(user, Role.normalUserRoles);
}


User.hasStudentRole = (user) => {

}

User.hasNativeRole = (user) => {

}

User.hasLanguageRole = (user) => {
    return User.hasRole(user, Role.languages);
}

User.hasCountryRole = (user) => {
    return User.hasRole(user, Role.countries);
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