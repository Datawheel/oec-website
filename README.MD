# OEC Canon Website

...

## Subnational Data

...

### How to add a new subnational map to `/subnational` section?
- Requirement: Country data must be ingested.
- Find the 3-letter country code from `ISO 3166`. Check [here](https://www.iban.com/country-codes).
- Identify what are the administrative levels presents in the new country's data. Could be one or more: Regions & Comunas, or just Areas.
- Play with [Tesseract UI](https://api.oec.world/ui/) queries to get the names of each member per level.
- Check with Google Maps or Wikipedia if the names (members and levels) are correct.
- Go to [GADM](https://gadm.org/download_country_v3.html) or [IGISMAP](https://www.igismap.com/) or any official place to get the shapes and find the right map for each level.
- If file size is too big for web -probably it is- simplify it, we don't need too many details. You can use any tool. [MapShaper](https://mapshaper.org/) works great, is easy to use and in-browser. Also resolve some overlapping points.
- Export the maps in `TOPOJSON` format and save it (static/shapes)[static/shapes] with name `subnational_<3 letter country code>_<level slug (plural)>.topojson`;
- Open for edit the topojson file using [geojson.io](http://geojson.io/) table view (or any other tool).
- Make sure to create/update an `id` and  `name` columns based on tesseract ui query to match the ids with shapes. Pay attention on that.
- Remove any other useless property. We just need `id` and `name`.
- Export it with the same name than before. (Make a copy if you are not sure of the results).
- Go to [consts.js](app/helpers/consts.js) file and add a new item inside `SUBNATIONAL_COUNTRIES` array.
- Replace the object values with your own data.
```
    {
      name: "Brazil",
      code: "bra",
      dimension: "Subnat Geography",
      geoLevels: [
        {name: "States", level: "Region", slug: "states"},
        {name: "Municipalities", level: "Subnat Geography", slug: "municipalities"}
      ]
    }
```
- Test the new country in `/subnational`.
- Success!
