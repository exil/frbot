var Role = {};

// enum for role names. value represents
// actual role name in Discord (should replace with ID)
Role.names = {
    // french level
    'BEGINNER': 'beginner',
    'INTERMEDIATE': 'intermediate',
    'ADVANCED': 'advanced',
    'NATIVE': 'Francophone natif',
    // native language
    'ENGLISH': 'Anglophone natif',
    'FRENCH': 'Francophone natif',
    'SPANISH': 'Hispanophone natif',
    'ITALIAN': 'Italophone natif',
    'GERMAN': 'Germanophone natif',
    'PORTUGUESE': 'Lusophone natif',
    'GREEK': 'Grécophone natif',
    'SWEDISH': 'Suédophone natif',
    'FINNISH': 'Finnophone natif',
    // country
    'UNITED_STATES': 'États-Unis',
    'UNITED_KINGDOM': 'Royaume-Uni',
    'IRELAND': 'Irland',
    'AUSTRALIA': 'Australie',
    'CANADA': 'Canada',
    'FRANCE': 'France'
}
// possible names for each role
Role.alts = {
    'beginner': Role.names.BEGINNER,
    'debutant': Role.names.BEGINNER,
    'débutant': Role.names.BEGINNER,
    'debutante': Role.names.BEGINNER,
    'débutante': Role.names.BEGINNER,
    'intermediate': Role.names.INTERMEDIATE,
    'intermediaire': Role.names.INTERMEDIATE,
    'intermédiaire': Role.names.INTERMEDIATE,
    'advanced': Role.names.ADVANCED,
    'avancé': Role.names.ADVANCED,
    'avancée': Role.names.ADVANCED,
    'native': Role.names.NATIVE,
    'natif': Role.names.NATIVE,
    // languages
    'english': Role.names.ENGLISH,
    'anglais': Role.names.ENGLISH,
    'french': Role.names.FRENCH,
    'francais': Role.names.FRENCH,
    'français': Role.names.FRENCH,
    'spanish': Role.names.SPANISH,
    'espagnol': Role.names.SPANISH,
    'italian': Role.names.ITALIAN,
    'italien': Role.names.ITALIAN,
    'allemand': Role.names.GERMAN,
    'portuguese': Role.names.PORTUGUESE,
    'portugais': Role.names.PORTUGUESE,
    'greek': Role.names.GREEK,
    'grec': Role.names.GREEK,
    'swedish': Role.names.SWEDISH,
    'suedois': Role.names.SWEDISH,
    'suédois': Role.names.SWEDISH,
    'finnish': Role.names.FINNISH,
    'finnois': Role.names.FINNISH,
    // countries
    'united states': Role.names.UNITED_STATES,
    'united states of america': Role.names.UNITED_STATES,
    'us': Role.names.UNITED_STATES,
    'usa': Role.names.UNITED_STATES,
    'etats-unis': Role.names.UNITED_STATES,
    'états-unis': Role.names.UNITED_STATES,
    'états unis': Role.names.UNITED_STATES,
    'etats unis': Role.names.UNITED_STATES,
    'uk': Role.names.UNITED_KINGDOM,
    'united kingdom': Role.names.UNITED_KINGDOM,
    'ireland': Role.names.IRELAND,
    'irlande': Role.names.IRELAND,
    'australia': Role.names.AUSTRALIA,
    'australie': Role.names.AUSTRALIA,
    'france': Role.names.FRANCE,
    'canada': Role.names.CANADA,
}
Role.normalUserRoles = [
    Role.names.BEGINNER,
    Role.names.INTERMEDIATE,
    Role.names.ADVANCED,
    Role.names.NATIVE
];
Role.languages = [
    Role.names.ENGLISH,
    Role.names.FRENCH,
    Role.names.SPANISH,
    Role.names.ITALIAN,
    Role.names.PORTUGUESE,
    Role.names.GREEK,
    Role.names.SWEDISH,
    Role.names.FINNISH
];
Role.countries = [
    Role.names.UNITED_STATES,
    Role.names.UNITED_KINGDOM,
    Role.names.IRELAND,
    Role.names.AUSTRALIA,
    Role.names.FRANCE,
    Role.names.CANADA
];

module.exports = Role;