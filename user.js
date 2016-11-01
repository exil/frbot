var Discord = require("discord.js");
var Role = require("./role");

var User = {};

User.hasNormalUserRole = (user) => {
    let roles = Role.normalUserRoles;
    for (let i = 0, len = roles.length; i < len; i++) {
        if (user.roles.has(roles[i])) {
            return true;
        }
    }

    return false;
}


User.hasStudentRole = (user) => {

}

User.hasNativeRole = (user) => {

}

module.exports = User;