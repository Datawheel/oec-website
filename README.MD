# OEC Canon Website

## CMS Best Practices

### Data URLs

All generator and visualization URLs should never contain the hostname of the server, unless it is going to an external non-OEC source (like Macro Market). For example:

#### Incorrect URL ❌
`https://api.oec.world/tesseract/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=Exporter+Country&measures=Trade+Value`

#### Correct URL ✅
`/olap-proxy/data.jsonrecords?cube=trade_i_baci_a_92&drilldowns=Exporter+Country&measures=Trade+Value`

All data calls need to be routed through the `/olap-proxy` endpoint, which handles redirecting to the correct Tesseract endpoint. It also authenticates the request, so that PRO users receive data from cubes that are not open publically.

This also applies to all URLs that hit a `/stats` endpoint. For example:

#### Incorrect URL ❌
`https://dev.oec.world/api/stats/relatedness?cube=trade_i_baci_a_92&filter_hs92=010101&time=year.latest&measures=Trade+Value&rca=Exporter+Country,Trade+Value`

#### Correct URL ✅
`/api/stats/relatedness?cube=trade_i_baci_a_92&filter_hs92=010101&time=year.latest&measures=Trade+Value&rca=Exporter+Country,Trade+Value`

By starting URLs with a forward slash `/`, all CMS and client (d3plus) requests will be routed to localhost. This also applies to all manually constructed anchor links. For example:

#### Incorrect URL ❌
`<a href="https://dev.oec.world/en/profile/country/usa">United States</a>`

#### Correct URL ✅
`<a href="/en/profile/country/usa">United States</a>`

## Subnational Data

### How to add a new subnational map to `/subnational` section?
- Requirement: Country data must be ingested.
- Find the 3-letter country code from `ISO 3166`. Check [here](https://www.iban.com/country-codes).
- Identify what are the administrative levels presents in the new country's data. Could be one or more: Regions & Comunas, or just Areas.
- Play with [Tesseract UI](https://api.oec.world/ui/) queries to get the names of each member per level.
- Check with Google Maps or Wikipedia if the names (members and levels) are correct.
- Go to [GADM](https://gadm.org/download_country_v3.html) or [IGISMAP](https://www.igismap.com/) or any official place to get the shapes and find the right map for each level.
- If file size is too big for web -probably it is- simplify it, we don't need too many details. You can use any tool. [MapShaper](https://mapshaper.org/) works great, is easy to use and in-browser. Also resolve some overlapping points.
- Export the maps in `TOPOJSON` format and save it (static/shapes)[static/shapes] with name `subnational_<3 letter country code>_<level slug (plural)>.topojson`;
- Open for edit the topojson file using [geojson.io](http://geojson.io/) table view (or any other tool). You can edit using also: [https://geoman.io/](https://geoman.io/)
- Make sure to create/update an `id` and  `name` columns based on tesseract ui query to match the ids with shapes. Pay attention on that.
- Remove any other useless property. We just need `id` and `name`.
- Sometimes we use `type` column for clarify geo level that are mixed in the same file.
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
