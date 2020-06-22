const {merge} = require("d3-array");
const sequelize = require("sequelize");

const tiles = [
  {
    link: "/profile/bilateral-country/usa/partner/chn",
    large: true
  },
  "/en/profile/hs92/rubber-surgical-gloves",
  "/profile/subnational_usa_port/chicago-il-3901",
  "/profile/country/gbr",
  {
    link: "/profile/subnational_usa_state/ca",
    large: true
  },
  "/profile/subnational_esp/valencia",
  "/profile/subnational_bra_state/rio-de-janeiro",
  "/profile/hs92/crude-petroleum",
  {
    link: "/profile/hs92/disinfectants-packaged-for-retail-sale",
    large: true,
    title: "Hand Sanitizer"
  },
  "/profile/bilateral-product/therapeutic-respiration-apparatus/reporter/aus",
  "/profile/subnational_rus/omsk-region",
  "/en/profile/bilateral-product/rubber-surgical-gloves/reporter/mys",
  "/profile/country/fra",
  {
    link: "/profile/subnational_usa_district/new-york-city-ny",
    large: true
  },
  "/profile/subnational_jpn/kanagawa",
  "/profile/country/ury",
  "/profile/subnational_bra_municipality/sao-paulo-3450308",
  {
    link: "/profile/subnational_chn/hubei-province",
    large: true
  },
  "/profile/subnational_can/ontario",
  "/profile/country/irn",
  "/profile/subnational_deu/berlin",
  {
    link: "/profile/hs92/therapeutic-respiration-apparatus",
    large: true
  },
  "/profile/subnational_esp/sevilla",
  "/profile/subnational_jpn/tokyo",
  "/profile/bilateral-product/soybeans/reporter/bra",
  {
    link: "/profile/subnational_deu/baden-wurttemberg",
    large: true
  },
  "/profile/subnational_usa_district/new-orleans-la",
  "/profile/subnational_jpn/fukushima",
  "/profile/subnational_esp/barcelona-8",
  {
    link: "/profile/subnational_usa_port/los-angeles-ca-2704",
    large: true
  },
  // {
  //   link: "/visualize/tree_map/hs17/export/show/all/6300215/2018/",
  //   title: "Immunological Testing Kits",
  //   image: "https://live.staticflickr.com/65535/49712164952_3757aebf01_k.jpg"
  // },
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
  "/profile/subnational_bra_municipality/sao-jose-dos-campos",
  "/profile/subnational_usa_port/detroit-mi-3801",
  "/en/profile/bilateral-product/ground-nuts/reporter/gmb",
  "/profile/bilateral-country/bra/partner/arg",
  "/profile/country/lao",
  {
    link: "/profile/subnational_usa_district/houston-galveston-tx",
    large: true
  },
  "/profile/hs92/cars",
  "/profile/subnational_jpn/hokkaido",
  "/profile/subnational_usa_state/tx"

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
