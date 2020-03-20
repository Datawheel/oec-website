const path = require("path");
const spawn = require("child_process").spawn;
const jwt = require("jsonwebtoken");
const {OLAP_PROXY_SECRET} = process.env;

const API = `${process.env.CANON_CONST_BASE}.jsonrecords`;
const BASE_URL = "/api/predict";

module.exports = function(app) {

  app.get(`${BASE_URL}`, (req, res) => {
    const {user} = req;
    const pyFilePath = path.join(__dirname, "../calcs/predictions.py");

    // create json web token based on user auth
    const apiToken = jwt.sign(
      {
        auth_level: user ? user.role : 0,
        sub: user ? user.id : "localhost",
        status: "valid"
      },
      OLAP_PROXY_SECRET,
      {expiresIn: "30m"}
    );
    req.query.apiToken = apiToken;
    // console.log("------");
    // console.log(JSON.stringify(req.query));
    // console.log("------");
    const py = spawn(
      "python3",
      ["-W", "ignore", pyFilePath, JSON.stringify(req.query), API]
    );
    let respString = "";
    // return res.json({sd: "test"});

    // build response string based on results of python script
    py.stdout.on("data", data => respString += data.toString());
    // catch errors
    py.stderr.on("data", data => console.error(`\nstderr:\n${data}`));
    // return response
    py.stdout.on("end", () => {
      try {
        const dataResult = JSON.parse(respString);
        return res.json(dataResult);
      }
      catch (e) {
        console.error(`\nrespString:\n${e}`);
        return res.json({error: e});
      }
    });
  });

};
