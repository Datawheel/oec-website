// const axios = require("axios");
// const {mean} = require("d3-array");
const {merge} = require("d3-array");
const sequelize = require("sequelize");

const tiles = [
  {
    link: "/profile/country/aschn/bilateral-country/nausa",
    large: true
  },
  "/profile/country/sachl",
  "/profile/country/nausa",
  "/profile/country/eufra",
  "/profile/country/aschn",
  "/profile/country/asirn",
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
  "/profile/country/aschn/bilateral-product/cars",
  "/profile/country/eufra/bilateral-product/planes-helicopters-andor-spacecraft",
  {
    link: "/profile/country/asirn/bilateral-product/crude-petroleum",
    large: true
  },
  "/profile/country/sachl/bilateral-product/lithium-carbonates",
  "/profile/country/askor/bilateral-country/asjpn"
];

// To add once sub-nat profile IDs are resolved:
// moscow
// berlin
// shanghai

module.exports = function(app) {

  const {db} = app.settings;

  app.get("/api/home", async(req, res) => {

    const {language} = req.i18n;

    const tileData = tiles
      .map(d => typeof d === "string" ? {link: d} : d);

    tileData.forEach(tile => {
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
    });

    return res.json(tileData);

    // const origin = `http${ req.connection.encrypted ? "s" : "" }://${ req.headers.host }`;
    // const data = await axios.get(`${origin}/api/profilesearch?limit=5`)
    //   .then(resp => resp.data);
    // const types = ["country", "country/bilateral-country", "country/bilateral-product", "hs92"];
    // const profiles = Object.keys(data.profiles)
    //   .reduce((arr, key) => {
    //     if (types.includes(key)) {
    //       arr = arr.concat(data.profiles[key].slice(0, 5));
    //     }
    //     return arr;
    //   }, [])
    //   .sort((a, b) => mean(b, d => d.ranking) - mean(a, d => d.ranking))
    //   .map(profile => ({
    //     images: profile.map(d => `api/image?slug=${d.slug}&id=${d.id}&size=thumb`),
    //     link: `/${language}/profile/${profile.map(d => `${d.slug}/${d.id}`).join("/")}/`,
    //     title: profile.map(d => d.name).join(" & "),
    //     category: profile.map(d => d.memberDimension).join("/"),
    //     large: profile.length > 1
    //   }));

    // return res.json(profiles);
  });

};
