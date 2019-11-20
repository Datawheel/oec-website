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
