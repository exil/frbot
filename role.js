var Role = {};

// enum for role names. value represents
// actual role name in Discord (should replace with ID)
Role.names = {
    'BEGINNER': 'beginner',
    'INTERMEDIATE': 'intermediate',
    'ADVANCED': 'advanced',
    'NATIVE': 'native'
}
// possible names for each role
Role.alts = {
    'beginner': Role.BEGINNER,
    'debutant': Role.BEGINNER,
    'débutant': Role.BEGINNER,
    'debutante': Role.BEGINNER,
    'débutante': Role.BEGINNER,
    'intermediate': Role.INTERMEDIATE,
    'intermediaire': Role.INTERMEDIATE,
    'intermédiaire': Role.INTERMEDIATE,
    'advanced': Role.ADVANCED,
    'avancé': Role.ADVANCED,
    'avancée': Role.ADVANCED,
    'native': Role.NATIVE
    'natif': Role.NATIVE
}
Role.normalUserRoles = [Role.BEGINNER, Role.INTERMEDIATE, Role.ADVANCED, Role.NATIVE];

module.exports = Role;