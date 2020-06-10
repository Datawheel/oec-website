# OEC Canon Website

* [Contributor FAQs (CMS Best Practices)](contributor-faqs-cms-best-practices)
  * [Data URLs](data-urls)
  * [Showing a Paywall](showing-a-paywall)
* [Subnational Landing Page](subnational-landing-page)

---

## Contributor FAQs (CMS Best Practices)

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

### Showing a Paywall

Certain database tables have their access restricted to only certain classes of users, known as "roles". Based on the user's current "role", the tesseract API endpoints will selectively choose whether or not to return data for certain queries. The current user roles are as follows:
* `undefined` - No Account Made (needs to sign up)
* `0` - Free User Account (signed up, but no purchases made)
* `1` - Pro Account (purchased a subscription)
* `10` - Contributor (internal CMS contributor)

Currently, we are only limiting cubes for users with `role < 1`, so that only paying customers and internal team members get access to the premium content.

![](https://github.com/datawheel/oec-website/raw/canon-develop/docs/paywall-preview.png)

#### Step 1 - Set Up Materializer

To start making a paywall, a profile editor needs to create 3 variables in a materializer for that specific profile.

_Please Note: These variables only need to be set up once for each profile, so please check that they haven't already been set up for the profile you are working on. If they already have been set up, take note of their names and move onto Step 2._

```js
const {id, role} = variables.user;

return {
  isPro: role > 0, // boolean value that is true for pro users
  notPro: !role, // boolean value that is true for non-pro users
  paywallObject: {user: id} // config for the paywall
};
```

#### Step 2 - Hide Premium Visualization

Go into the section editor for the section that contains the visualization you would like to hide. Open the editor for that visualization, and change the "Visible" dropdown to use the `isPro` variable created from Step 1 (shown here circled in red):

![](https://github.com/datawheel/oec-website/raw/canon-develop/docs/paywall-hide.png)

#### Step 3 - Create the Paywall Visualization

In the same section where you hide the visualization in Step 2, add a new visualization of type "HTML". This "visualization" is going to be our paywall, only visible to "non-Pro" users.

[HTML visualizations](https://github.com/Datawheel/canon/tree/master/packages/cms#html-visualizations) allow any custom HTML string to be injected into the page. The visualization editor allows you to select a variable to be used as this injected HTML, and a formatter on that variable (if needed). We can use this to pass our `paywallObject` through a global `Paywall` formatter that exists in order to create the appropriate HTML string. Make sure you also set the "Visible" status to `notPro`. The 4 selections you need to make are highlighted here in red:

![](https://github.com/datawheel/oec-website/raw/canon-develop/docs/paywall-hide.png)

#### Advanced Paywall Features

There are properties in the Paywall formatter that can be overridden by the `paywallObject` you create in the materializer. These properties can be used to further customize the display of the paywall for the specific profile. You can even create multiple paywall objects to be used in different sections on the same page! Here are all of the current settings with their default values:

```js
{
  button: "Click here to sign up!",
  image: undefined, // full image path (overrides "type" image)
  title: "This feature is only available for PRO accounts.",
  type: "Treemap", // d3plus viz type for background image
  url: user ? "/en/account" : "/en/signup",
  user: undefined // determines the default link behavior
}
```

---

## Subnational Landing Page

### How do I add a new subnational map to the `/subnational` page?
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

---

## Installation / Deployment on Ubuntu Linux

The following packages are required for using the latest version of puppeteer 3+ which uses the latest chromium:

```
sudo apt-get update && apt-get install -y libgtk2.0-0 libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb libgbm-dev
```

We use puppeteer for the screenshot server.
