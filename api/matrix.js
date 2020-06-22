module.exports = function(app) {

  app.get("/api/matrix", async(req, res) => {
    const {cache} = app.settings;

    return res.json(cache.cubesMetadata);
  });
};
