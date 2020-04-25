const {merge} = require("d3-array");
const sequelize = require("sequelize");

const tiles = [
  {
    link: "/profile/bilateral-country/usa/partner/chn",
    large: true
  },
  "/en/profile/hs92/rubber-surgical-gloves",
  "/profile/country/chl",
  "/profile/subnational_esp/valencia",
  "/profile/hs92/crude-petroleum",
  {
    link: "/profile/bilateral-product/therapeutic-respiration-apparatus/reporter/aus",
    larg: true
  },
  "/profile/subnational_rus/omsk-region",
  "/en/profile/bilateral-product/rubber-surgical-gloves/reporter/mys",
  "/profile/subnational_can/ontario",
  "/profile/country/fra",
  "/profile/subnational_jpn/kanagawa",
  {
    link: "/profile/subnational_chn/hubei-province",
    large: true
  },
  "/profile/hs92/therapeutic-respiration-apparatus",
  "/profile/country/irn",
  "/profile/subnational_deu/berlin",
  "/profile/subnational_esp/sevilla",
  "/profile/subnational_jpn/tokyo",
  "/profile/bilateral-product/soybeans/reporter/bra",
  {
    link: "/profile/subnational_deu/baden-wurttemberg",
    large: true
  },
  "/profile/subnational_jpn/fukushima",
  "/profile/subnational_esp/barcelona-8",
  "/profile/subnational_rus/volgograd-region",
  "/profile/hs92/semiconductor-devices",
  "/profile/subnational_can/quebec",
  {
    link: "/profile/hs92/medical-surgical-or-laboratory-sterilizers",
    large: true
  },
  "/profile/subnational_jpn/kyoto",
  "/profile/bilateral-product/cars/reporter/chn",
  "/profile/subnational_chn/guangdong-province",
  "/profile/subnational_deu/bavaria",
  "/profile/bilateral-product/planes-helicopters-andor-spacecraft/reporter/fra",
  "/profile/subnational_rus/komi-republic",
  {
    link: "/profile/bilateral-product/medical-surgical-or-laboratory-sterilizers/reporter/ita",
    large: true
  },
  "/profile/bilateral-product/lithium-carbonates/reporter/chl",
  "/profile/bilateral-country/jpn/partner/kor",
  "/profile/subnational_esp/a-coruna",
  "/profile/bilateral-product/crude-petroleum/reporter/irn",
  "/profile/subnational_jpn/nagasaki",
  "/profile/subnational_chn/shanghai-province",
  "/profile/subnational_rus/moscow-the-capital-of-russian-federation",
  {
    link: "/en/profile/bilateral-country/ukr/partner/rus",
    large: true
  },
  "/profile/subnational_esp/galicia",
  "/profile/subnational_jpn/hiroshima",
  "/profile/subnational_can/alberta",
  "/profile/subnational_chn/sichuan-province",
  "/profile/country/usa",
  "/profile/subnational_deu/hamburg",
  {
    link: "/profile/subnational_esp/madrid",
    large: true
  },
  "/en/profile/bilateral-product/packaged-medicaments/reporter/irl",
  "/profile/bilateral-country/prt/partner/esp",
  "/profile/subnational_esp/vizcaya",
  "/profile/hs92/lcds",
  "/profile/subnational_jpn/nagano",
  {
    link: "/profile/subnational_rus/st-petersburg",
    large: true
  },
  "/en/profile/bilateral-product/ground-nuts/reporter/gmb",
  "/profile/bilateral-country/bra/partner/arg",
  "/profile/country/lao",
  "/profile/hs92/cars",
  "/profile/subnational_jpn/hokkaido"

  // {
  //   link: "/profile/firm/disney-enterprises-inc-fa8492d090",
  //   image: "https://i.ytimg.com/vi/_iIxfFZW-NE/maxresdefault.jpg"
  // },
  // {
  //   link: "/profile/technology/solar-heat-collectors-solar-heat-systems",
  //   large: true
  // },
  // {
  //   link: "/profile/firm/tesla-inc",
  //   large: true
  // },

  // "/profile/firm/samsung-electronics-co-ltd-b8c1acc425",
  // "/profile/firm/apple-inc",
  // "/profile/subnational_usa/los-angeles-ca",
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

    let tileData = tiles
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

    tileData = tileData.reduce((tileArray, tile) => {
      if (tile.link.includes("profile")) {
        tile.entities = tile.entities
          .reduce((arr, entity) => {
            const dim = slugToDimension[entity.slug];
            const e = entityRows.find(row => row.dimension === dim && [row.id, row.slug].includes(entity.id));
            if (e) {
              const content = e.content.find(c => c.locale === language) || e.content.find(c => c.locale === "en");
              arr.push({
                dimension: e.dimension,
                hierarchy: e.hierarchy,
                id: e.id,
                slug: entity.slug,
                title: content.name
              });
            }
            return arr;
          }, []);
        if (tile.entities.length && (tile.entities.length > 1 || !["hs92", "country"].includes(tile.entities[0].slug))) {
          tile.new = true;
        }
        if (tile.entities.length) {
          tileArray.push(tile);
        }
      }
      else {
        tileArray.push(tile);
      }
      tile.link = `/${language}${tile.link}`;
      return tileArray;
    }, []);

    return res.json(tileData);

  });

};
