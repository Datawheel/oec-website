// After refactoring, rename file as rankingsBuilder and delete the ? variables
import {range} from './utils';

export const DATASETS = [
	{name: 'HS92', lang: 'hs92', title: 'HS92 - 1992', available: true, cubeName: 'trade_i_baci_a_92', basecube: 'HS', availableDepths: ['HS4', 'HS6'], defaultDepth: 'HS4', yearsRange: range(1995, 2018)},
	{name: 'HS96', lang: 'hs96', title: 'HS96 - 1996', available: true, cubeName: 'trade_i_baci_a_96', basecube: 'HS', availableDepths: ['HS4', 'HS6'], defaultDepth: 'HS4', yearsRange: range(1998, 2018)},
	{name: 'HS02', lang: 'hs02', title: 'HS02 - 2002', available: true, cubeName: 'trade_i_baci_a_02', basecube: 'HS', availableDepths: ['HS4', 'HS6'], defaultDepth: 'HS4', yearsRange: range(2003, 2018)},
	{name: 'HS07', lang: 'hs07', title: 'HS07 - 2007', available: true, cubeName: 'trade_i_baci_a_07', basecube: 'HS', availableDepths: ['HS4', 'HS6'], defaultDepth: 'HS4', yearsRange: range(2008, 2018)},
	{name: 'HS12', lang: 'hs12', title: 'HS12 - 2012', available: true, cubeName: 'trade_i_baci_a_12', basecube: 'HS', availableDepths: ['HS4', 'HS6'], defaultDepth: 'HS4', yearsRange: range(2012, 2018)},
	{name: 'HS17', lang: 'hs17', title: 'HS17 - 2017', available: false, cubeName: 'trade_i_baci_a_17', basecube: 'HS', availableDepths: ['HS4', 'HS6'], defaultDepth: 'HS4', yearsRange: range(2018, 2018)},
	{name: 'Category', lang: 'category', title: 'Category', available: false, cubeName: 'trade_i_comtrade_a_sitc2_new', basecube: 'SITC', availableDepths: ['Category', 'Section', 'Division', 'Group', 'Subgroup'], defaultDepth: 'Subgroup', yearsRange: range(1962, 2018)},
	{name: 'Section', lang: 'section', title: 'Section', available: false, cubeName: 'trade_i_comtrade_a_sitc2_new', basecube: 'SITC', availableDepths: ['Category', 'Section', 'Division', 'Group', 'Subgroup'], defaultDepth: 'Subgroup', yearsRange: range(1962, 2018)},
	{name: 'Division', lang: 'division', title: 'Division', available: false, cubeName: 'trade_i_comtrade_a_sitc2_new', basecube: 'SITC', availableDepths: ['Category', 'Section', 'Division', 'Group', 'Subgroup'], defaultDepth: 'Subgroup', yearsRange: range(1962, 2018)},
	{name: 'Group', lang: 'group', title: 'Group', available: false, cubeName: 'trade_i_comtrade_a_sitc2_new', basecube: 'SITC', availableDepths: ['Category', 'Section', 'Division', 'Group', 'Subgroup'], defaultDepth: 'Subgroup', yearsRange: range(1962, 2018)},
	{name: 'Subgroup', lang: 'subgroup', title: 'Subgroup', available: false, cubeName: 'trade_i_comtrade_a_sitc2_new', basecube: 'SITC', availableDepths: ['Category', 'Section', 'Division', 'Group', 'Subgroup'], defaultDepth: 'Subgroup', yearsRange: range(1962, 2018)}
];

export const REVISION_OPTIONS = [
	{name: 'HS4', value: 'HS4', basecube: 'HS', available: true},
	{name: 'HS6', value: 'HS6', basecube: 'HS', available: true},
	{name: 'SITC', value: 'SITC', basecube: 'SITC', available: false}
];

export const SUBNATIONAL_DATASETS = {
	bra: {productDepth: ['HS4'], defaultDepth: 'HS4', yearsRange: range(1997, 2019)},
	jpn: {productDepth: ['HS4'], defaultDepth: 'HS4', yearsRange: range(2009, 2019)},
	rus: {productDepth: ['HS4'], defaultDepth: 'HS4', yearsRange: range(2015, 2019)},
	can: {productDepth: ['HS4'], defaultDepth: 'HS4', yearsRange: range(1988, 2019)},
	ury: {productDepth: ['Section', 'HS2'], defaultDepth: 'HS2', yearsRange: range(2010, 2018)},
	deu: {productDepth: ['EGW1', 'Product'], defaultDepth: 'EGW', yearsRange: range(1980, 2019)},
	usa: {productDepth: ['HS4'], defaultDepth: 'HS4', yearsRange: range(2019, 2019)},
	tur: {productDepth: ['Section'], defaultDepth: 'Section', yearsRange: range(2002, 2019)},
	esp: {productDepth: ['HS4'], defaultDepth: 'HS4', yearsRange: range(2010, 2019)},
	zaf: {productDepth: ['HS4'], defaultDepth: 'HS4', yearsRange: range(2018, 2019)},
	chn: {productDepth: ['HS4'], defaultDepth: 'HS4', yearsRange: range(2018, 2019)},
	fra: {productDepth: ['Level 3'], defaultDepth: 'Level 3', yearsRange: range(1990, 2020)},
	bol: {productDepth: ['Section', 'Division', 'Group'], defaultDepth: 'Section', yearsRange: range(2006, 2019)},
	ecu: {productDepth: ['HS4'], defaultDepth: 'HS4', yearsRange: range(2013, 2019)},
	gbr: {productDepth: ['HS4'], defaultDepth: 'HS4', yearsRange: range(2011, 2019)}
};

// ?
export const yearsNational = {
	Category: {initial: 1962, final: 2018},
	Section: {initial: 1962, final: 2018},
	Division: {initial: 1962, final: 2018},
	Group: {initial: 1962, final: 2018},
	Subgroup: {initial: 1962, final: 2018},
	HS92: {initial: 1995, final: 2018},
	HS96: {initial: 1998, final: 2018},
	HS02: {initial: 2003, final: 2018},
	HS07: {initial: 2008, final: 2018},
	HS12: {initial: 2012, final: 2018}
};

// ?
export const subnationalData = {
	can: {
		cube: 'can_m_hs',
		basecube: 'HS',
		profile: 'can',
		geo: 'Subnat Geography',
		initial: 1988,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'can'
	},
	chn: {
		cube: 'chn_m_hs',
		basecube: 'HS',
		profile: 'chn',
		geo: 'Subnat Geography',
		initial: 2019,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'chn'
	},
	deu: {
		cube: 'deu_m_egw',
		basecube: 'EGW',
		profile: 'deu',
		geo: 'Subnat Geography',
		initial: 1980,
		final: 2019,
		productDepth: ['EGW1', 'Product'],
		flag: 'deu'
	},
	'jpn': {
		cube: 'jpn_m_hs',
		basecube: 'HS',
		profile: 'jpn',
		geo: 'Region',
		initial: 2009,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'jpn'
	},
	'Japan (Prefactures)': {
		cube: 'jpn_m_hs',
		basecube: 'HS',
		profile: 'jpn',
		geo: 'Subnat Geography',
		initial: 2009,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'jpn'
	},
	'rus': {
		cube: 'rus_m_hs',
		basecube: 'HS',
		profile: 'rus',
		geo: 'Subnat Geography',
		initial: 2015,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'rus'
	},
	'Russia (Districts)': {
		cube: 'rus_m_hs',
		basecube: 'HS',
		profile: 'rus',
		geo: 'District',
		initial: 2015,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'rus'
	},
	'esp': {
		cube: 'esp_m_hs',
		basecube: 'HS',
		profile: 'esp',
		geo: 'Autonomous Communities',
		initial: 2010,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'esp'
	},
	'Spain (Provincies)': {
		cube: 'esp_m_hs',
		basecube: 'HS',
		profile: 'esp',
		geo: 'Subnat Geography',
		initial: 2010,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'esp'
	},
	'Brazil (State)': {
		cube: 'bra_ncm_m_hs',
		basecube: 'HS',
		profile: 'bra_state',
		geo: 'Subnat Geography',
		initial: 1997,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'bra'
	},
	'Brazil (Municipality)': {
		cube: 'bra_mun_m_hs',
		basecube: 'HS',
		profile: 'bra_municipality',
		geo: 'Subnat Geography',
		initial: 1997,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'bra'
	},
	Bolivia: {
		cube: 'bol_m_sitc3',
		basecube: 'SITC',
		profile: '',
		geo: 'Subnat Geography',
		initial: 2006,
		final: 2019,
		productDepth: ['Section', 'Division', 'Group'],
		flag: 'bol'
	},
	Ecuador: {
		cube: 'ecu_m_hs',
		basecube: 'HS',
		profile: 'ecu',
		geo: 'Subnat Geography',
		initial: 2013,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'ecu'
	},
	'South Africa': {
		cube: 'zaf_m_hs',
		basecube: 'HS',
		profile: 'zaf',
		geo: 'Subnat Geography',
		initial: 2018,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'zaf'
	},
	Turkey: {
		cube: 'tur_m_hs',
		basecube: 'HS',
		profile: 'tur',
		geo: 'Subnat Geography',
		initial: 2002,
		final: 2019,
		productDepth: ['Section'],
		flag: 'tur'
	},
	'United Kingdom': {
		cube: 'gbr_m_hs',
		basecube: 'HS',
		profile: 'gbr',
		geo: 'Subnat Geography',
		initial: 2011,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'gbr'
	},
	'United States (State)': {
		cube: 'usa_state_m_hs',
		basecube: 'HS',
		profile: 'usa_state',
		geo: 'Subnat Geography',
		initial: 2019,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'usa'
	},
	'United States (District)': {
		cube: 'usa_district_m_hs',
		basecube: 'HS',
		profile: 'usa_district',
		geo: 'Subnat Geography',
		initial: 2019,
		final: 2019,
		productDepth: ['HS4'],
		flag: 'usa'
	},
	Uruguay: {
		cube: 'ury_a_hs',
		basecube: 'HS',
		profile: 'ury',
		geo: 'Subnat Geography',
		initial: 2010,
		final: 2018,
		productDepth: ['Section', 'HS2'],
		flag: 'ury'
	}
};
