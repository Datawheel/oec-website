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
    const countryCandidates = ["chn", "deu", "usa", "jpn", "kor", "fra", "ita", "nld", "mex", "gbr", "can", "blx", "rus", "esp", "ind", "che", "mys", "sgp", "aus", "vnm", "bra", "tha", "pol", "idn", "sau", "tur", "cze", "irl", "aut", "swe", "are", "hkg", "hun", "zaf", "nor", "phl", "dnk", "svk", "rou", "fin", "chl", "irq", "prt", "arg", "irn", "qat", "isr", "nga", "kwt", "ukr", "per", "kaz", "bgd", "col", "dza", "nzl", "omn", "ago", "bgr", "grc", "egy", "blr", "ven", "svn", "ltu", "mar", "pak", "ecu", "gha", "srb", "lby", "tun", "khm", "mmr", "est", "aze", "lva", "lka", "cri", "civ", "gtm", "zmb", "cog", "png", "ury", "hnd", "dom", "uzb", "tto", "hrv", "jor", "bol", "cod", "tkm", "mng", "pry", "moz", "bih", "mkd", "ken", "slv", "isl", "brn", "bhr", "nic", "tza", "gab", "gnq", "sdn", "cmr", "mlt", "lbn", "cyp", "sen", "mdg", "geo", "mrt", "pan", "gin", "mda", "uga", "sur", "arm", "mus", "alb", "bfa", "mli", "eth", "guy", "lao", "zwe", "kgz", "prk", "tgo", "yem", "ncl", "cub", "mac", "jam", "ssd", "cuw", "hti", "tcd", "lbr", "fji", "bhs", "tjk", "grl", "afg", "mwi", "sle", "npl", "syc", "slb", "ben", "syr", "ner", "cym", "mne", "brb", "blz", "vgb", "mhl", "gib", "mdv", "eri", "gnb", "abw", "vct", "atg", "rwa", "flk", "vut", "som", "btn", "gmb", "bdi", "pyf", "bmu", "smr", "cpv", "and", "tls", "pse", "lca", "com", "kna", "wsm", "niu", "caf", "tkl", "dji", "kir", "dma", "cok", "grd", "asm", "maf", "fsm", "nru"];
    if (path.includes("country")) {
      return countryCandidates[Math.floor(Math.random() * countryCandidates.length)];
    }
    if (path.includes("partner")) {
      const c1Index = Math.floor(Math.random() * countryCandidates.length);
      const c1 = countryCandidates.splice(c1Index, 1)[0];
      const c2 = countryCandidates[Math.floor(Math.random() * countryCandidates.length)];
      return `${c1}/country/${c2}`;
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
