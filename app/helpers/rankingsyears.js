export const yearsNational = {
	Category: {initial: 2000, final: 2018},
	Section: {initial: 2000, final: 2018},
	Division: {initial: 2000, final: 2018},
	Group: {initial: 2000, final: 2018},
	Subgroup: {initial: 2000, final: 2018},
	HS92: {initial: 1995, final: 2018},
	HS96: {initial: 1998, final: 2018},
	HS02: {initial: 2003, final: 2018},
	HS07: {initial: 2008, final: 2018},
	HS12: {initial: 2012, final: 2018}
};

export const initialYearsNational = {
	Category: 2000,
	Section: 2000,
	Division: 2000,
	Group: 2000,
	Subgroup: 2000,
	HS92: 1995,
	HS96: 1998,
	HS02: 2003,
	HS07: 2008,
	HS12: 2012
};

export const finalYearsNational = {
	Category: 2018,
	Section: 2018,
	Division: 2018,
	Group: 2018,
	Subgroup: 2018,
	HS92: 2018,
	HS96: 2018,
	HS02: 2018,
	HS07: 2018,
	HS12: 2018
};

export const subnationalCountries = [
	'Brazil (State)',
	'Brazil (Municipality)',
	'Bolivia',
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

export const subnationalData = {
	'Brazil (State)': {
		cube: 'bra_ncm_m_hs',
		geo: 'Subnat Geography',
		initial: 1997,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'bra'
	},
	'Brazil (Municipality)': {
		cube: 'bra_mun_m_hs',
		geo: 'Subnat Geography',
		initial: 1997,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'bra'
	},
	Bolivia: {
		cube: 'bol_m_sitc3',
		geo: 'Subnat Geography',
		initial: 2006,
		final: 2019,
		productDepth: [ 'Section', 'Division', 'Group', 'Product' ],
		flag: 'bol'
	},
	Canada: {
		cube: 'can_m_hs',
		geo: 'Subnat Geography',
		initial: 1988,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'can'
	},
	China: {
		cube: 'chn_m_hs',
		geo: 'Subnat Geography',
		initial: 2019,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'chn'
	},
	Ecuador: {
		cube: 'ecu_m_hs',
		geo: 'Subnat Geography',
		initial: 2013,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'ecu'
	},
	Japan: {
		cube: 'jpn_m_hs',
		geo: 'Subnat Geography',
		initial: 2009,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'jpn'
	},
	Russia: {
		cube: 'rus_m_hs',
		geo: 'Subnat Geography',
		initial: 2015,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'rus'
	},
	'South Africa': {
		cube: 'zaf_m_hs',
		geo: 'Subnat Geography',
		initial: 2018,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'zaf'
	},
	Spain: {
		cube: 'esp_m_hs',
		geo: 'Subnat Geography',
		initial: 2010,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'esp'
	},
	Turkey: {
		cube: 'tur_m_hs',
		geo: 'Subnat Geography',
		initial: 2002,
		final: 2019,
		productDepth: [ 'Section', 'Product' ],
		flag: 'tur'
	},
	'United Kingdom': {
		cube: 'gbr_m_hs',
		geo: 'Subnat Geography',
		initial: 2011,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'gbr'
	},
	'United States (State)': {
		cube: 'usa_state_m_hs',
		geo: 'Subnat Geography',
		initial: 2019,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'usa'
	},
	'United States (District)': {
		cube: 'usa_district_m_hs',
		geo: 'Subnat Geography',
		initial: 2019,
		final: 2019,
		productDepth: [ 'Section', 'HS2', 'HS4', 'Product' ],
		flag: 'usa'
	},
	Uruguay: {
		cube: 'ury_a_hs',
		geo: 'Subnat Geography',
		initial: 2010,
		final: 2018,
		productDepth: [ 'Section', 'HS2', 'Product' ],
		flag: 'ury'
	}
};
