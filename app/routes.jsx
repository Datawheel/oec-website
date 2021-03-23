import React from "react";
import {Route, IndexRoute, browserHistory} from "react-router";

import {Builder} from "@datawheel/canon-cms";
import Profile from "./pages/Profile";
import ProfileShareImg from "./pages/Profile/ProfileShareImg";
import Subnational from "./pages/Subnational/Subnational";
import PredictionLanding from "./pages/Prediction/PredictionLanding";
import Prediction from "./pages/Prediction/Prediction";
import Tariffs from "./pages/Tariffs/Tariffs";

import App from "./App";
import Home from "./pages/Home";
import Keytest from "./pages/Keytest";
import Welcome from "./pages/Welcome";
import Explorer from "./pages/Explorer";
import Vizbuilder from "./pages/Vizbuilder";
import Login from "./pages/User/Login";
import SignUp from "./pages/User/SignUp";
import Reset from "./pages/User/Reset";
import Account from "./pages/User/Account";
// import Subscription from "./pages/User/Subscription";
import Rankings from "./pages/Rankings";
import Resources from "./pages/Resources";
import Loading from "components/Loading";
import ErrorPage from "./pages/ErrorPage";
import Covid from "./pages/Covid";

import {HS_TO_OEC_HS} from "helpers/consts";

/** */
export default function RouteCreate() {

  /** */
  function genRandId(path) {
    const countryCandidates = ["chn", "deu", "usa", "jpn", "kor", "fra", "ita", "nld", "mex", "gbr", "can", "blx", "rus", "esp", "ind", "che", "mys", "sgp", "aus", "vnm", "bra", "tha", "pol", "idn", "sau", "tur", "cze", "irl", "aut", "swe", "are", "hkg", "hun", "zaf", "nor", "phl", "dnk", "svk", "rou", "fin", "chl", "irq", "prt", "arg", "irn", "qat", "isr", "nga", "kwt", "ukr", "per", "kaz", "bgd", "col", "dza", "nzl", "omn", "ago", "bgr", "grc", "egy", "blr", "ven", "svn", "ltu", "mar", "pak", "ecu", "gha", "srb", "lby", "tun", "khm", "mmr", "est", "aze", "lva", "lka", "cri", "civ", "gtm", "zmb", "cog", "png", "ury", "hnd", "dom", "uzb", "tto", "hrv", "jor", "bol", "cod", "tkm", "mng", "pry", "moz", "bih", "mkd", "ken", "slv", "isl", "brn", "bhr", "nic", "tza", "gab", "gnq", "sdn", "cmr", "mlt", "lbn", "cyp", "sen", "mdg", "geo", "mrt", "pan", "gin", "mda", "uga", "sur", "arm", "mus", "alb", "bfa", "mli", "eth", "guy", "lao", "zwe", "kgz", "prk", "tgo", "yem", "cub", "mac", "jam", "ssd", "cuw", "hti", "tcd", "lbr", "fji", "bhs", "tjk", "grl", "afg", "mwi", "sle", "npl", "syc", "ben", "syr", "ner", "cym", "mne", "brb", "blz", "vgb", "mhl", "mdv", "eri", "gnb", "abw", "vct", "atg", "rwa", "flk", "vut", "som", "btn", "gmb", "bdi", "pyf", "bmu", "cpv", "and", "tls", "pse", "com", "kna", "wsm", "niu", "caf", "dji", "kir", "dma", "grd", "asm", "maf"];
    const hs6Candidates = ["2090121", "5270900", "5271000", "17870323", "6300490", "16854219", "16854211", "16852520", "16847330", "14710812", "17870324", "5271121", "17870332", "17880240", "16847120", "17870899", "5271111", "16847193", "16852810", "17870322", "16851790", "16847192", "14710239", "5270112", "16852990", "17880330", "16847191", "5260111", "17870829", "16847989", "14711319", "15740311", "17890190", "18901380", "7392690", "6300210", "17870421", "17870840", "16851782", "14710231", "16848180", "16844390", "16850440", "16841191", "16854140", "2120100", "16853400", "18901890", "5260300", "16847199", "6382390"];
    const hs4Candidates = ["52709", "178703", "52710", "168542", "168471", "178708", "63004", "52711", "168525", "147108", "168473", "168517", "178802", "178704", "147102", "168411", "168544", "168479", "52701", "189018", "168541", "178901", "168536", "168528", "168504", "63002", "52601", "209403", "168529", "178803", "168481", "74011", "62933", "168443", "168414", "73901", "209401", "168409", "116204", "73926", "189013", "168431", "168413", "147113", "126403", "157403", "157208", "116110", "157601", "73907"];
    const hs4BilatCandidates = [[52709, "ago"], [52711, "ago"], [20901, "bdi"], [147108, "bdi"], [115201, "ben"], [20801, "ben"], [147108, "bfa"], [115201, "bfa"], [94403, "caf"], [94407, "caf"], [41801, "civ"], [74001, "civ"], [52709, "cmr"], [94407, "cmr"], [158105, "cod"], [157403, "cod"], [52709, "cog"], [178905, "cog"], [20907, "com"], [63301, "com"], [41604, "cpv"], [10303, "cpv"], [20901, "dji"], [94402, "dji"], [52711, "dza"], [52709, "dza"], [52709, "egy"], [147108, "egy"], [52608, "eri"], [52603, "eri"], [20901, "eth"], [21207, "eth"], [52709, "gab"], [52602, "gab"], [147108, "gha"], [52709, "gha"], [52606, "gin"], [147108, "gin"], [94403, "gmb"], [20801, "gmb"], [20801, "gnb"], [10303, "gnb"], [52709, "gnq"], [52711, "gnq"], [20902, "ken"], [20603, "ken"], [178901, "lbr"], [147108, "lbr"], [52709, "lby"], [52711, "lby"], [178703, "mar"], [63105, "mar"], [20905, "mdg"], [157502, "mdg"], [147108, "mli"], [115203, "mli"], [52704, "moz"], [52701, "moz"], [52601, "mrt"], [147108, "mrt"], [41604, "mus"], [41701, "mus"], [42401, "mwi"], [20902, "mwi"], [62844, "ner"], [52710, "ner"], [52709, "nga"], [52711, "nga"], [20901, "rwa"], [20902, "rwa"], [147108, "sdn"], [52709, "sdn"], [52710, "sen"], [62809, "sen"], [10306, "shn"], [10303, "shn"], [52601, "sle"], [52614, "sle"], [10104, "som"], [10102, "som"], [52709, "ssd"], [157204, "ssd"], [41801, "stp"], [52710, "stp"], [41604, "syc"], [10303, "syc"], [52709, "tcd"], [21301, "tcd"], [52710, "tgo"], [147108, "tgo"], [168544, "tun"], [116203, "tun"], [147108, "tza"], [20801, "tza"], [20901, "uga"], [147108, "uga"], [147108, "zaf"], [147102, "zaf"], [157402, "zmb"], [157403, "zmb"], [42401, "zwe"], [157202, "zwe"], [10303, "atf"], [10304, "atf"], [20806, "afg"], [21301, "afg"], [52709, "are"], [52710, "are"], [52603, "arm"], [42402, "arm"], [52709, "aze"], [52711, "aze"], [116203, "bgd"], [116109, "bgd"], [52710, "bhr"], [157601, "bhr"], [52711, "brn"], [52709, "brn"], [157202, "btn"], [62849, "btn"], [168443, "cck"], [168517, "cck"], [168525, "chn"], [168471, "chn"], [52510, "cxr"], [63103, "cxr"], [52710, "cyp"], [63004, "cyp"], [52603, "geo"], [157202, "geo"], [147108, "hkg"], [168525, "hkg"], [52701, "idn"], [31511, "idn"], [52710, "ind"], [147102, "ind"], [10303, "iot"], [52711, "iot"], [52709, "irn"], [73901, "irn"], [52709, "irq"], [52710, "irq"], [147102, "isr"], [63004, "isr"], [52510, "jor"], [116110, "jor"], [178703, "jpn"], [178708, "jpn"], [52709, "kaz"], [157403, "kaz"], [147108, "kgz"], [52616, "kgz"], [116110, "khm"], [116104, "khm"], [168542, "kor"], [178703, "kor"], [52709, "kwt"], [52710, "kwt"], [52603, "lao"], [74001, "lao"], [147108, "lbn"], [168471, "lbn"], [20902, "lka"], [116212, "lka"], [147113, "mac"], [189101, "mac"], [52711, "mdv"], [10304, "mdv"], [52711, "mmr"], [20713, "mmr"], [52701, "mng"], [52603, "mng"], [168542, "mys"], [52710, "mys"], [115509, "npl"], [115701, "npl"], [52709, "omn"], [52711, "omn"], [116302, "pak"], [116203, "pak"], [168542, "phl"], [168473, "phl"], [52701, "prk"], [116201, "prk"], [20804, "pse"], [157204, "pse"], [52711, "qat"], [52709, "qat"], [52709, "sau"], [52710, "sau"], [168542, "sgp"], [52710, "sgp"], [20909, "syr"], [31509, "syr"], [168473, "tha"], [168542, "tha"], [157601, "tjk"], [147108, "tjk"], [52711, "tkm"], [52710, "tkm"], [52709, "tls"], [20901, "tls"], [178703, "tur"], [147108, "tur"], [147108, "uzb"], [52711, "uzb"], [168525, "vnm"], [168517, "vnm"], [168542, ""], [189013, ""], [52709, "yem"], [147108, "yem"], [126403, "alb"], [126406, "alb"], [168542, "and"], [52710, "and"], [63004, "aut"], [178708, "aut"], [52710, "bgr"], [157403, "bgr"], [209401, "bih"], [52716, "bih"], [52710, "blr"], [63104, "blr"], [178703, "blx"], [52710, "blx"], [147108, "che"], [63004, "che"], [178703, "cze"], [178708, "cze"], [178703, "deu"], [178708, "deu"], [63004, "dnk"], [10203, "dnk"], [178703, "esp"], [52710, "esp"], [168525, "est"], [52710, "est"], [52710, "fin"], [104810, "fin"], [178802, "fra"], [63004, "fra"], [178703, "gbr"], [63004, "gbr"], [178905, "gib"], [178802, "gib"], [52710, "grc"], [63004, "grc"], [63004, "hrv"], [52710, "hrv"], [178703, "hun"], [178708, "hun"], [63004, "irl"], [63002, "irl"], [157601, "isl"], [10304, "isl"], [63004, "ita"], [178703, "ita"], [52710, "ltu"], [209403, "ltu"], [94407, "lva"], [168525, "lva"], [168544, "mda"], [21206, "mda"], [63815, "mkd"], [168421, "mkd"], [168542, "mlt"], [52710, "mlt"], [52606, "mne"], [157601, "mne"], [52710, "nld"], [168525, "nld"], [52709, "nor"], [52711, "nor"], [178708, "pol"], [178703, "pol"], [52710, "prt"], [178703, "prt"], [178708, "rou"], [168544, "rou"], [52709, "rus"], [52710, "rus"], [178703, "srb"], [168544, "srb"], [178703, "svk"], [178708, "svk"], [178703, "svn"], [63004, "svn"], [178703, "swe"], [52710, "swe"], [31512, "ukr"], [157207, "ukr"], [52710, "abw"], [178802, "abw"], [42208, "aia"], [178903, "aia"], [178901, "atg"], [178903, "atg"], [52710, "bes"], [52501, "bes"], [178901, "bhs"], [52710, "bhs"], [63104, "blm"], [62902, "blm"], [41701, "blz"], [20803, "blz"], [178802, "bmu"], [52711, "bmu"], [42208, "brb"], [147108, "brb"], [52709, "can"], [178703, "can"], [20803, "cri"], [20804, "cri"], [41701, "cub"], [42402, "cub"], [52710, "cuw"], [147108, "cuw"], [178903, "cym"], [147108, "cym"], [178901, "dma"], [41801, "dma"], [147108, "dom"], [42402, "dom"], [20908, "grd"], [10302, "grd"], [10303, "grl"], [10306, "grl"], [20803, "gtm"], [20901, "gtm"], [116109, "hnd"], [20901, "hnd"], [116109, "hti"], [116110, "hti"], [62818, "jam"], [52606, "jam"], [168525, "kna"], [189031, "kna"], [52710, "lca"], [20803, "lca"], [147108, "maf"], [147113, "maf"], [178703, "mex"], [178708, "mex"], [178903, "msr"], [52505, "msr"], [168544, "nic"], [116109, "nic"], [52710, "pan"], [52707, "pan"], [116109, "slv"], [116110, "slv"], [10305, "spm"], [10307, "spm"], [42208, "tca"], [10307, "tca"], [52711, "tto"], [52710, "tto"], [52710, "usa"], [178703, "usa"], [178905, "vct"], [52711, "vct"], [178903, "vgb"], [52710, "vgb"], [42301, "asm"], [199301, "asm"], [52601, "aus"], [52701, "aus"], [42201, "fji"], [41701, "fji"], [10303, "fsm"], [10304, "fsm"], [168443, "gum"], [189102, "gum"], [10303, "kir"], [21203, "kir"], [178901, "mhl"], [178903, "mhl"], [62804, "mnp"], [157204, "mnp"], [168479, "nfk"], [21209, "nfk"], [178901, "niu"], [168536, "niu"], [52510, "nru"], [62804, "nru"], [10402, "nzl"], [10204, "nzl"], [74011, "pcn"], [20908, "pcn"], [10302, "plw"], [168471, "plw"], [52711, "png"], [147108, "png"], [147101, "pyf"], [10302, "pyf"], [42304, "arg"], [21005, "arg"], [52711, "bol"], [52608, "bol"], [21201, "bra"], [52601, "bra"], [52603, "chl"], [157403, "chl"], [52709, "col"], [52701, "col"], [52709, "ecu"], [20803, "ecu"], [10307, "flk"], [10303, "flk"], [147108, "guy"], [178609, "guy"], [52603, "per"], [147108, "per"], [21201, "pry"], [42304, "pry"], [147108, "sur"], [147112, "sur"], [104703, "ury"], [10202, "ury"], [52709, "ven"], [52710, "ven"]];
    const productCandidates = hs6Candidates.concat(hs4Candidates);
    const technologyCandidates = ["A", "B", "C", "D", "E", "F", "G", "H", "Y", "H0", "G0", "A6", "B6", "C0", "B2", "A4", "F0", "F2", "B0", "F1", "Y0", "E0", "C2", "B4", "A0", "E2", "D0", "A2", "F4", "B8", "G1", "D2", "G2", "C4", "H04", "G06", "H01", "A61", "G01", "B60", "G02", "B01", "H02", "B65", "F16", "A47", "C07", "H05", "C08", "F21", "A63", "F02", "G03", "G09", "H03", "B29", "F01", "G05", "G11", "C09", "A01", "G08", "C12", "F25", "Y02", "B23", "F04", "B32", "B41", "E21", "B62", "G10", "F24", "E04", "A43", "B64", "A45", "G07", "B25", "C10", "E05", "B05", "F05", "G06F", "H01L", "H04L", "A61B", "H04W", "H04N", "G02B", "A61M", "G01N", "A61K", "B65D", "H01M", "G06T", "G06Q", "A61F", "H04B", "G06K", "H05K", "Y10T", "B01D", "G02F", "G09G", "H01R", "H04R", "C07D", "H04M", "B01J", "G01R", "A63B", "B29C", "B32B", "E21B", "H02M", "H02J", "G11C", "B60R", "A61N", "B41J", "H05B", "G01S", "H01Q", "F21S", "A43B", "F21V", "B60W", "H02K", "H01J", "G03G", "G08B", "C07C"];
    const firmCandidates = ["11bc748915", "a157918810", "b8c1acc425", "87de88d17b", "7a01e8ddac", "15d39b3f2a", "2eb971d57b", "dbc08b2573", "0faa77ca42", "abb53dc868", "23d57363cb", "b5e019f538", "6ad9ab7fc6", "cb321ed4d0", "5517da6319", "9f34a7c959", "4bdae8f1a7", "3dac8941a0", "e916d571f1", "f44eedb4a5", "0d3a83bfc8", "41ef0cf58d", "2f111a9ce2", "decf643da9", "a206115bd6", "811141d321", "a6fed19225", "16993cffaa", "442fdaabf5", "adb93bfc8e", "dc35081fb7", "dc40dfac00", "1765456121", "fae178ebf4", "c99fe1e0b9", "7827e711f4", "67f88397c5", "9f4299c85f", "ffe06cf343", "5a72270be0", "b33fbe57f2", "e2bf16c475", "27d1fe114b", "9f7704687f", "4d70b25495", "8e4d49bd8c", "1574143f54", "ace192312e", "69177dc604", "1c7fe6585c", "a4f0a651d6", "bdce540b93", "78ce8bd6ea", "26c8a5e500", "37ce6630a8", "edef3c419a", "b9ff98ac74", "96a8b4d3ac", "4a8f5060b0", "e3806d07bb", "66d76d37cc", "48c29d69a7", "a46913eda0", "6a8460a7f8", "4af00db829", "0a8c2269fd", "fdd08023dc", "46cf408a4d", "7ec5a3132d", "32050ae9ac", "8eaa0d8c1a", "d348d7f6fb", "3cb89b4de4", "d354337a5f", "c61317f152", "c0cc9dc323", "f589dbeca8", "bf0ddf34a6", "79a53b8347", "95080624a7", "23ab12e369", "7a4f0a0373", "848b635c85", "57c8aa446e", "d2e6d21938", "e8e745a379", "72ddda3a57", "28fa7aedd5", "cfbea0d3af", "88639e7689", "f47f95da7e", "54c228ff08", "0f6a4563c4", "81ff8a9f5a", "f5eb75e633", "beccddfa85", "9fa4977ce4", "1700aa6b92", "a8a7a9e4f9", "55d803de66", "9f988f3d7b"];

    if (path.includes("visualize")) {
      return countryCandidates[Math.floor(Math.random() * countryCandidates.length)];
    }
    if (path.includes("bilateral-country")) {
      const c1Index = Math.floor(Math.random() * countryCandidates.slice(0, 80).length);
      const c1 = countryCandidates.splice(c1Index, 1)[0];
      const c2 = countryCandidates[Math.floor(Math.random() * countryCandidates.length)];
      return `${c1}/partner/${c2}`;
    }
    if (path.includes("bilateral-product")) {
      const [bilatProd, bilatCountry] = hs4BilatCandidates[Math.floor(Math.random() * hs4BilatCandidates.length)];
      return `${bilatProd}/reporter/${bilatCountry}`;
    }
    if (path.includes("country")) {
      return countryCandidates[Math.floor(Math.random() * countryCandidates.length)];
    }
    if (path.includes("hs92")) {
      return productCandidates[Math.floor(Math.random() * productCandidates.length)];
    }
    if (path.includes("technology")) {
      return technologyCandidates[Math.floor(Math.random() * technologyCandidates.length)];
    }
    if (path.includes("firm")) {
      return firmCandidates[Math.floor(Math.random() * firmCandidates.length)];
    }
    return null;
  }

  /** */
  function checkForId(nextState, replace) {
    const {location, params} = nextState;
    const reqestedUrl = location.pathname;
    if (!params.id) {
      const randId = genRandId(reqestedUrl);
      const nextUrl = reqestedUrl.slice(-1) === "/" ? `${reqestedUrl}${randId}` : `${reqestedUrl}/${randId}`;
      return replace({pathname: nextUrl});
    }
    else if (reqestedUrl.includes("profile/hs92") && HS_TO_OEC_HS[params.id]) {
      const nextUrl = reqestedUrl.replace(params.id, HS_TO_OEC_HS[params.id]);
      return replace({pathname: nextUrl});
    }
    return null;
  }

  /** */
  function checkForVizId(nextState, replace) {
    const {params} = nextState;
    const reqestedUrl = nextState.location.pathname;
    if (!nextState.params.chart) {
      const randId = genRandId(reqestedUrl);
      const nextUrl = reqestedUrl.slice(-1) === "/"
        ? `${reqestedUrl}tree_map/hs92/export/${randId}/all/show/2018/`
        : `${reqestedUrl}/tree_map/hs92/export/${randId}/all/show/2018/`;
      return replace({pathname: nextUrl});
    }
    if (
      ["hs92", "hs96", "hs02", "hs07", "hs12", "hs17"].includes(params.cube) &&
      HS_TO_OEC_HS[params.viztype]
    ) {
      const nextUrl = reqestedUrl.replace(params.viztype, HS_TO_OEC_HS[params.viztype]);
      return replace({pathname: nextUrl});
    }
    return null;
  }

  return (
    <Route path="/" component={App} history={browserHistory}>
      <IndexRoute component={Home} />
      <Route exact path="(/:lang)" component={Home} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/loading" component={Loading} />
      <Route path="/:lang/profile-share/:slug(/:id)(/:slug2)(/:id2)" component={ProfileShareImg} />
      <Route path="/:lang/profile/:slug(/:id)(/:slug2)(/:id2)" component={Profile} onEnter={checkForId} />
      <Route exact path="/admin" component={Builder} />
      <Route exact path="/explorer" component={Explorer} />
      <Route exact path="/:lang/visualize/embed/:chart/:cube/:flow/:country/:partner/:viztype/:time" component={props => <Vizbuilder {...props} isEmbed={true} />} onEnter={checkForVizId} />
      <Route exact path="/:lang/visualize(/:chart)(/:cube)(/:flow)(/:country)(/:partner)(/:viztype)(/:time)" component={Vizbuilder} onEnter={checkForVizId} />
      <Route exact path="/:lang/login" component={Login} />
      <Route exact path="/:lang/signup" component={SignUp} />
      <Route exact path="/:lang/reset" component={Reset} />
      <Route exact path="/:lang/account" component={Account} />
      <Route exact path="/:lang/covid(/:dataset)" component={Covid} />
      {/* <Route exact path="/:lang/subscription" component={Subscription} /> */}
      <Route exact path="/:lang/subnational" component={Subnational} />
      <Route exact path="/:lang/prediction" component={PredictionLanding} />
      <Route exact path="/:lang/prediction/:dataset" component={Prediction} />
      <Route exact path="/:lang/resources/:page" component={Resources} />
      <Route exact path="/:lang/tariffs" component={Tariffs} />
      <Route path="/:lang/rankings/:page(/:depth)(/:rev)" component={Rankings} />
      <Route path="/:lang/keytest" component={Keytest} />
      <Route path="*" component={ErrorPage} />
    </Route>
  );
}
