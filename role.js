var db = require('./db');

var Role = {};

Role.names = {
    // french level
    'beginner': 'Débutant',
    'intermediate': 'Intermédiaire',
    'advanced': 'Avancé',
    'native': 'Francophone Natif',
}
Role.studentRoles = [
    Role.names.beginner,
    Role.names.intermediate,
    Role.names.advanced,
    Role.names.native
];
Role.languages = [];
Role.languagesFriendly = [];
Role.countries = [];
Role.countriesFriendly = [];
Role.NO_COUNTRY = 'SANS PAYS';
Role.NO_LANGUAGE = 'SANS LANGUE';
Role.alts = {};

var init = () => {
    db.query('SELECT * FROM languages').on('result', function(row) {
        Role.names[row.friendly.toLowerCase()] = row.role;
		Role.alts[row.role.toLowerCase()] = row.role;

        if (!Role.languages.includes(row.role)) {
            Role.languages.push(row.role);
            Role.languagesFriendly.push(row.friendly);
        }
    }).on('error', function(err) {
        console.log('Error loading languages: ' + err);
    }).on('end', function() {
        // sort alpha
        Role.languagesFriendly.sort();
    });

    db.query('SELECT * FROM countries').on('result', function(row) {
        Role.names[row.friendly.toLowerCase()] = row.role;
        Role.alts[row.role.toLowerCase()] = row.role;

        if (!Role.countries.includes(row.role)) {
            Role.countries.push(row.role);
            Role.countriesFriendly.push(row.friendly);
        }
    }).on('error', function(err) {
        console.log('Error loading countries: ' + err);
    }).on('end', function() {
        // all rows have been received
        Role.countriesFriendly.sort();
    });
}

init();


Role.add = (english, french, type) => {
	db.query('SET NAMES utf8');

	if (type === 'countries' || type === 'languages') {
			var start = 'INSERT INTO ' + type;
			db.query(start + ' (friendly, role) VALUES (?, ?)', [english, french], function (error, results, fields) {
				if (error) {
					console.log('error adding role to database:' + error);
				} else {
					console.log('added ' + english + '|' + french + ' to ' + type + ' table');
				}
			});
	}
};

// helper functions
Role.isLanguageRole = (role) => {
    return Role.languagesFriendly.some(function(el, i) {
        return el.toLowerCase() === role.toLowerCase();
    });
};

// helper functions
Role.isCountryRole = (role) => {
    return Role.countriesFriendly.some(function(el, i) {
        return el.toLowerCase() === role.toLowerCase();
    });
}

// possible names for each role
Role.alts = Object.assign(Role.alts, {
    // 'beginner': Role.names.BEGINNER,
    // 'debutant': Role.names.BEGINNER,
    // 'débutant': Role.names.BEGINNER,
    // 'debutante': Role.names.BEGINNER,
    // 'débutante': Role.names.BEGINNER,
    // 'intermediate': Role.names.INTERMEDIATE,
    // 'intermediaire': Role.names.INTERMEDIATE,
    // 'intermédiaire': Role.names.INTERMEDIATE,
    // 'advanced': Role.names.ADVANCED,
    // 'avancé': Role.names.ADVANCED,
    // 'avancée': Role.names.ADVANCED,
    // 'native': Role.names.NATIVE,
    // 'natif': Role.names.NATIVE,
    // languages
    // 'english': Role.names.ENGLISH,
    // 'anglais': Role.names.ENGLISH,
    // 'french': Role.names.FRENCH,
    // 'francais': Role.names.FRENCH,
    // 'français': Role.names.FRENCH,
    // 'spanish': Role.names.SPANISH,
    // 'espagnol': Role.names.SPANISH,
    // 'italian': Role.names.ITALIAN,
    // 'italien': Role.names.ITALIAN,
    // 'allemand': Role.names.GERMAN,
    // 'portuguese': Role.names.PORTUGUESE,
    // 'portugais': Role.names.PORTUGUESE,
    // 'greek': Role.names.GREEK,
    // 'grec': Role.names.GREEK,
    // 'swedish': Role.names.SWEDISH,
    // 'suedois': Role.names.SWEDISH,
    // 'suédois': Role.names.SWEDISH,
    // 'finnish': Role.names.FINNISH,
    // 'finnois': Role.names.FINNISH,
    // countries
    'français': 'Francophone Natif',
    'united states': 'États-Unis',
    'united states of america': 'États-Unis',
    'us': 'États-Unis',
    'usa': 'États-Unis',
    'america': 'États-Unis',
    'uk': 'Royaume-Uni',
    'united kingdom': 'Royaume-Uni'
    // 'etats-unis': Role.names.UNITED_STATES,
    // 'états-unis': Role.names.UNITED_STATES,
    // 'états unis': Role.names.UNITED_STATES,
    // 'etats unis': Role.names.UNITED_STATES,
    // 'ireland': Role.names.IRELAND,
    // 'irlande': Role.names.IRELAND,
    // 'australia': Role.names.AUSTRALIA,
    // 'australie': Role.names.AUSTRALIA,
    // 'france': Role.names.FRANCE,
    // 'canada': Role.names.CANADA,
});

module.exports = Role;
