var db = require('./db');

var Role = {};

Role.names = {
    // french level
    'beginner': 'Débutant',
    'intermediate': 'Intermédiaire',
    'advanced': 'avancé',
    'native': 'Francophone natif',
}
Role.normalUserRoles = [
    Role.names.beginner,
    Role.names.intermediate,
    Role.names.advanced,
    Role.names.native
];
Role.languages = [];
Role.countries = [];


Role.init = () => {
    db.query('SELECT * FROM languages').on('result', function(row) {
        Role.names[row.friendly.toLowerCase()] = row.role;
        if (!Role.languages.includes(row.role)) {
            Role.languages.push(row.role);
        }
    }).on('error', function(err) {
        console.log('Error loading languages: ' + err);
    }).on('end', function() {
        // sort alpha
        Role.languages.sort((a, b) => {return a > b});
    });

    db.query('SELECT * FROM countries').on('result', function(row) {
        Role.names[row.friendly.toLowerCase()] = row.role;
        if (!Role.countries.includes(row.role)) {
            Role.countries.push(row.role);
        }
    }).on('error', function(err) {
        console.log('Error loading countries: ' + err);
    }).on('end', function() {
        // all rows have been received
        Role.countries.sort((a, b) => {return a > b});
    });
}

Role.init();

// possible names for each role
/*Role.alts = {
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
}*/

module.exports = Role;