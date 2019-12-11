import React from "react";
import {Route, IndexRoute, browserHistory} from "react-router";

import {Builder} from "@datawheel/canon-cms";
import Profile from "./pages/Profile";
import {Profile as CMSProfile} from "@datawheel/canon-cms";

import {Login, SignUp} from "@datawheel/canon-core";

import App from "./App";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";

/** */
export default function RouteCreate() {

  /** */
  function genRandId(path) {
    const countryCandidates = ["chn", "deu", "usa", "jpn", "kor", "fra", "ita", "nld", "mex", "gbr", "can", "blx", "rus", "esp", "ind", "che", "mys", "sgp", "aus", "vnm", "bra", "tha", "pol", "idn", "sau", "tur", "cze", "irl", "aut", "swe", "are", "hkg", "hun", "zaf", "nor", "phl", "dnk", "svk", "rou", "fin", "chl", "irq", "prt", "arg", "irn", "qat", "isr", "nga", "kwt", "ukr", "per", "kaz", "bgd", "col", "dza", "nzl", "omn", "ago", "bgr", "grc", "egy", "blr", "ven", "svn", "ltu", "mar", "pak", "ecu", "gha", "srb", "lby", "tun", "khm", "mmr", "est", "aze", "lva", "lka", "cri", "civ", "gtm", "zmb", "cog", "png", "ury", "hnd", "dom", "uzb", "tto", "hrv", "jor", "bol", "cod", "tkm", "mng", "pry", "moz", "bih", "mkd", "ken", "slv", "isl", "brn", "bhr", "nic", "tza", "gab", "gnq", "sdn", "cmr", "mlt", "lbn", "cyp", "sen", "mdg", "geo", "mrt", "pan", "gin", "mda", "uga", "sur", "arm", "mus", "alb", "bfa", "mli", "eth", "guy", "lao", "zwe", "kgz", "prk", "tgo", "yem", "ncl", "cub", "mac", "jam", "ssd", "cuw", "hti", "tcd", "lbr", "fji", "bhs", "tjk", "grl", "afg", "mwi", "sle", "npl", "syc", "slb", "ben", "syr", "ner", "cym", "mne", "brb", "blz", "vgb", "mhl", "mdv", "eri", "gnb", "abw", "vct", "atg", "rwa", "flk", "vut", "som", "btn", "gmb", "bdi", "pyf", "bmu", "smr", "cpv", "and", "tls", "pse", "lca", "com", "kna", "wsm", "niu", "caf", "dji", "kir", "dma", "cok", "grd", "asm", "maf", "fsm"];
    const hs6Candidates = ["2090121", "5270900", "5271000", "17870323", "6300490", "16854219", "16854211", "16852520", "16847330", "14710812", "17870324", "5271121", "17870332", "17880240", "16847120", "17870899", "5271111", "16847193", "16852810", "17870322", "16851790", "16847192", "14710239", "5270112", "16852990", "17880330", "16847191", "5260111", "17870829", "16847989", "14711319", "15740311", "17890190", "18901380", "7392690", "6300210", "17870421", "17870840", "16851782", "14710231", "16848180", "16844390", "16850440", "16841191", "16854140", "2120100", "16853400", "18901890", "5260300", "16847199", "6382390"];
    const hs4Candidates = ["52709", "47631", "52710", "37470", "37399", "47636", "63004", "52711", "37453", "16036", "37401", "37445", "47730", "47632", "16030", "37339", "37472", "37407", "52701", "57946", "37469", "47829", "37464", "37456", "37432", "63002", "52601", "12795", "37457", "47731", "37409", "8475", "62933", "37371", "37342", "8365", "12793", "37337", "50668", "8390", "57941", "37359", "37341", "16041", "60867", "26331", "26136", "50574", "26529", "8371", "37349", "8384", "37335", "47629", "37411", "37429", "50667"];
    const productCandidates = hs6Candidates.concat(hs4Candidates);
    const technologyCandidates = ["A", "B", "C", "D", "E", "F", "G", "H", "Y", "H0", "G0", "A6", "B6", "C0", "B2", "A4", "F0", "F2", "B0", "F1", "Y0", "E0", "C2", "B4", "A0", "E2", "D0", "A2", "F4", "B8", "G1", "D2", "G2", "C4", "H04", "G06", "H01", "A61", "G01", "B60", "G02", "B01", "H02", "B65", "F16", "A47", "C07", "H05", "C08", "Y10", "F21", "A63", "F02", "G03", "G09", "H03", "B29", "F01", "G05", "G11", "C09", "A01", "G08", "C12", "F25", "Y02", "B23", "F04", "B32", "B41", "E21", "B62", "G10", "F24", "E04", "A43", "B64", "A45", "G07", "B25", "C10", "E05", "B05", "F05", "G06F", "H01L", "H04L", "A61B", "H04W", "H04N", "G02B", "A61M", "G01N", "A61K", "B65D", "H01M", "G06T", "G06Q", "A61F", "H04B", "G06K", "H05K", "Y10T", "B01D", "G02F", "G09G", "H01R", "H04R", "C07D", "H04M", "B01J", "G01R", "A63B", "B29C", "B32B", "E21B", "H02M", "H02J", "G11C", "B60R", "A61N", "B41J", "H05B", "G01S", "H01Q", "F21S", "A43B", "F21V", "B60W", "H02K", "H01J", "G03G", "G08B", "C07C"];
    const firmCandidates = ["11bc748915", "a157918810", "b8c1acc425", "87de88d17b", "7a01e8ddac", "15d39b3f2a", "2eb971d57b", "dbc08b2573", "0faa77ca42", "abb53dc868", "23d57363cb", "b5e019f538", "6ad9ab7fc6", "cb321ed4d0", "5517da6319", "9f34a7c959", "4bdae8f1a7", "3dac8941a0", "e916d571f1", "f44eedb4a5", "0d3a83bfc8", "41ef0cf58d", "2f111a9ce2", "decf643da9", "a206115bd6", "811141d321", "a6fed19225", "16993cffaa", "442fdaabf5", "adb93bfc8e", "dc35081fb7", "dc40dfac00", "1765456121", "fae178ebf4", "c99fe1e0b9", "7827e711f4", "67f88397c5", "9f4299c85f", "ffe06cf343", "5a72270be0", "b33fbe57f2", "e2bf16c475", "27d1fe114b", "9f7704687f", "4d70b25495", "8e4d49bd8c", "1574143f54", "ace192312e", "69177dc604", "1c7fe6585c", "a4f0a651d6", "bdce540b93", "78ce8bd6ea", "26c8a5e500", "37ce6630a8", "edef3c419a", "b9ff98ac74", "96a8b4d3ac", "4a8f5060b0", "e3806d07bb", "66d76d37cc", "48c29d69a7", "a46913eda0", "6a8460a7f8", "4af00db829", "0a8c2269fd", "fdd08023dc", "46cf408a4d", "7ec5a3132d", "32050ae9ac", "8eaa0d8c1a", "d348d7f6fb", "3cb89b4de4", "d354337a5f", "c61317f152", "c0cc9dc323", "f589dbeca8", "bf0ddf34a6", "79a53b8347", "95080624a7", "23ab12e369", "7a4f0a0373", "848b635c85", "57c8aa446e", "d2e6d21938", "e8e745a379", "72ddda3a57", "28fa7aedd5", "cfbea0d3af", "88639e7689", "f47f95da7e", "54c228ff08", "0f6a4563c4", "81ff8a9f5a", "f5eb75e633", "beccddfa85", "9fa4977ce4", "1700aa6b92", "a8a7a9e4f9", "55d803de66", "9f988f3d7b"];

    if (path.includes("bilateral-country")) {
      const c1Index = Math.floor(Math.random() * countryCandidates.slice(0, 80).length);
      const c1 = countryCandidates.splice(c1Index, 1)[0];
      const c2 = countryCandidates[Math.floor(Math.random() * countryCandidates.length)];
      return `${c1}/country/${c2}`;
    }
    if (path.includes("bilateral-product")) {
      const p = productCandidates[Math.floor(Math.random() * productCandidates.length)];
      const c = countryCandidates[Math.floor(Math.random() * countryCandidates.slice(0, 120).length)];
      return `${p}/country/${c}`;
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
    if (!nextState.params.id) {
      const reqestedUrl = nextState.location.pathname;
      const randId = genRandId(reqestedUrl);
      const nextUrl = reqestedUrl.slice(-1) === "/" ? `${reqestedUrl}${randId}` : `${reqestedUrl}/${randId}`;
      return replace({pathname: nextUrl});
    }
    return null;
  }

  return (
    <Route path="/" component={App} history={browserHistory}>
      <IndexRoute component={Home} />
      <Route exact path="(/:lang)" component={Home} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/:lang/profile/:slug(/:id)(/:slug2)(/:id2)" component={Profile} onEnter={checkForId} />
      <Route exact path="/admin" component={Builder} />
      <Route exact path="/:lang/login" component={Login} />
      <Route exact path="/:lang/signup" component={SignUp} />
    </Route>
  );
}
