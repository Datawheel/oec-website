const {merge} = require("d3-array");
const sequelize = require("sequelize");

const tiles = [
  {
    link: "/profile/bilateral-country/usa/country/chn",
    large: true
  },
  "/profile/country/chl",
  "/profile/country/usa",
  "/profile/country/fra",
  "/profile/country/chn",
  "/profile/country/irn",
  {
    link: "/profile/firm/disney-enterprises-inc-fa8492d090",
    image: "https://i.ytimg.com/vi/_iIxfFZW-NE/maxresdefault.jpg"
  },
  {
    link: "/profile/technology/solar-heat-collectors-solar-heat-systems",
    large: true
  },
  {
    link: "/profile/firm/tesla-inc",
    large: true
  },
  "/profile/firm/samsung-electronics-co-ltd-b8c1acc425",
  "/profile/firm/apple-inc-87de88d17b",
  {
    link: "/profile/hs92/semiconductor-devices",
    large: true
  },
  "/profile/bilateral-product/cars/country/chn",
  "/profile/bilateral-product/planes-helicopters-andor-spacecraft/country/fra",
  {
    link: "/profile/bilateral-product/crude-petroleum/country/irn",
    large: true
  },
  "/profile/bilateral-product/lithium-carbonates/country/chl",
  "/profile/bilateral-country/jpn/country/kor"
];

// To add once sub-nat profile IDs are resolved:
// moscow
// berlin
// shanghai
// tokyo

module.exports = function(app) {

  const {db} = app.settings;

  app.get("/api/home", async(req, res) => {

    const {language} = req.i18n;

    const tileData = tiles
      .map(d => typeof d === "string" ? {link: d} : d);

    tileData.forEach(tile => {

      const match = tile.link.match(/\/([a-z]{2})\//);
      if (match && match.index === 0) {
        tile.link = tile.link.replace(`${match[1]}/`, "");
      }

      if (tile.link.includes("profile")) {
        tile.entities = [];
        tile.link
          .replace("profile/", "")
          .match(/([^\/]{1,}\/[^\/]{1,})/g)
          .forEach(group => {
            const [slug, id] = group.split("/");
            tile.entities.push({slug, id});
          });
      }
    });

    const entitySlugs = tileData
      .map(d => d.entities.map(e => e.slug));
    const uniqueSlugs = Array.from(new Set(merge(entitySlugs)));

    const profileRows = await db.profile_meta
      .findAll({where: {slug: uniqueSlugs}});

    const slugToDimension = profileRows
      .reduce((obj, d) => {
        obj[d.slug] = d.dimension;
        return obj;
      }, {});

    const dimensionToSlug = profileRows
      .reduce((obj, d) => {
        obj[d.dimension] = d.slug;
        return obj;
      }, {});

    const entityIds = tileData
      .map(d => d.entities.map(e => e.id));
    const uniqueIds = Array.from(new Set(merge(entityIds)));

    const entityRows = await db.search
      .findAll({
        where: {
          [sequelize.Op.or]: {id: uniqueIds, slug: uniqueIds},
          dimension: Array.from(new Set(Object.values(slugToDimension)))
        },
        include: [{association: "content"}]
      });

    tileData.forEach(tile => {
      if (tile.link.includes("profile")) {
        tile.entities = tile.entities
          .map(entity => {
            const dim = slugToDimension[entity.slug];
            const e = entityRows.find(row => row.dimension === dim && [row.id, row.slug].includes(entity.id));
            const content = e.content.find(c => c.locale === language) || e.content.find(c => c.locale === "en");
            return {
              dimension: e.dimension,
              hierarchy: e.hierarchy,
              id: e.id,
              slug: dimensionToSlug[e.dimension],
              title: content.name
            };
          });
        if (tile.entities.length > 1 || !["hs92", "country"].includes(tile.entities[0].slug)) {
          tile.new = true;
        }
      }
      tile.link = `/${language}${tile.link}`;
    });

    return res.json(tileData);

  });

};
