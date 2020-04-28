export const yearsNational = {
	Category: { initial: 1962, final: 2018 },
	Section: { initial: 1962, final: 2018 },
	Division: { initial: 1962, final: 2018 },
	Group: { initial: 1962, final: 2018 },
	Subgroup: { initial: 1962, final: 2018 },
	HS92: { initial: 1995, final: 2018 },
	HS96: { initial: 1998, final: 2018 },
	HS02: { initial: 2003, final: 2018 },
	HS07: { initial: 2008, final: 2018 },
	HS12: { initial: 2012, final: 2018 }
};

export const subnationalCountries = [
	'Brazil (State)',
	'Brazil (Municipality)',
	// 'Bolivia',
	'Canada',
	'China',
	'Ecuador',
	'Japan',
	'Russia',
	'South Africa',
	'Spain',
	'Turkey',
	'United Kingdom',
	'United States (State)',
	'United States (District)',
	'Uruguay'
];

//productDepth: [ 'Section', 'HS2', 'HS4']

export const subnationalData = {
	'Brazil (State)': {
		cube: 'bra_ncm_m_hs',
		basecube: 'HS',
		profile: 'bra_state',
		geo: 'Subnat Geography',
		initial: 1997,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'bra'
	},
	'Brazil (Municipality)': {
		cube: 'bra_mun_m_hs',
		basecube: 'HS',
		profile: 'bra_municipality',
		geo: 'Subnat Geography',
		initial: 1997,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'bra'
	},
	Bolivia: {
		cube: 'bol_m_sitc3',
		basecube: 'SITC',
		profile: '',
		geo: 'Subnat Geography',
		initial: 2006,
		final: 2019,
		productDepth: [ 'Section', 'Division', 'Group' ],
		flag: 'bol'
	},
	Canada: {
		cube: 'can_m_hs',
		basecube: 'HS',
		profile: 'can',
		geo: 'Subnat Geography',
		initial: 1988,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'can'
	},
	China: {
		cube: 'chn_m_hs',
		basecube: 'HS',
		profile: 'chn',
		geo: 'Subnat Geography',
		initial: 2019,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'chn'
	},
	Ecuador: {
		cube: 'ecu_m_hs',
		basecube: 'HS',
		profile: 'ecu',
		geo: 'Subnat Geography',
		initial: 2013,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'ecu'
	},
	Japan: {
		cube: 'jpn_m_hs',
		basecube: 'HS',
		profile: 'jpn',
		geo: 'Subnat Geography',
		initial: 2009,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'jpn'
	},
	Russia: {
		cube: 'rus_m_hs',
		basecube: 'HS',
		profile: 'rus',
		geo: 'Subnat Geography',
		initial: 2015,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'rus'
	},
	'South Africa': {
		cube: 'zaf_m_hs',
		basecube: 'HS',
		profile: 'zaf',
		geo: 'Subnat Geography',
		initial: 2018,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'zaf'
	},
	Spain: {
		cube: 'esp_m_hs',
		basecube: 'HS',
		profile: 'esp',
		geo: 'Subnat Geography',
		initial: 2010,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'esp'
	},
	Turkey: {
		cube: 'tur_m_hs',
		basecube: 'HS',
		profile: 'tur',
		geo: 'Subnat Geography',
		initial: 2002,
		final: 2019,
		productDepth: [ 'Section' ],
		flag: 'tur'
	},
	'United Kingdom': {
		cube: 'gbr_m_hs',
		basecube: 'HS',
		profile: 'gbr',
		geo: 'Subnat Geography',
		initial: 2011,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'gbr'
	},
	'United States (State)': {
		cube: 'usa_state_m_hs',
		basecube: 'HS',
		profile: 'usa_state',
		geo: 'Subnat Geography',
		initial: 2019,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'usa'
	},
	'United States (District)': {
		cube: 'usa_district_m_hs',
		basecube: 'HS',
		profile: 'usa_district',
		geo: 'Subnat Geography',
		initial: 2019,
		final: 2019,
		productDepth: [ 'HS4' ],
		flag: 'usa'
	},
	Uruguay: {
		cube: 'ury_a_hs',
		basecube: 'HS',
		profile: 'ury',
		geo: 'Subnat Geography',
		initial: 2010,
		final: 2018,
		productDepth: [ 'Section', 'HS2' ],
		flag: 'ury'
	}
};
