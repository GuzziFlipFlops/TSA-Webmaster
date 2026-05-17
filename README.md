# Community Compass

TSA Webmaster 2026 project: **Community Resource Hub**.

Community Compass is a React/Vite/Tailwind website focused on students, families, school clubs, youth organizations, CTE/TSA programs, volunteering, local learning spaces, support services, events, and school/community funding.

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router
- Leaflet + OpenStreetMap map tiles
- Local JavaScript data profiles
- localStorage for saved preferences, saved items, and pending suggestions

## Setup

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Use `npm run dev` or a Vercel deployment when testing live Grants.gov search. `npm run preview` serves the static build only and does not run the local Vite proxy or Vercel serverless function.

## Vercel Deployment

Connect this GitHub repo to Vercel and use the default Vite settings:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

`vercel.json` includes a single-page app fallback so React Router routes work on refresh.

## Data and API Status

The current build uses a curated local dataset. No live API keys are required.

- Resources, grants, events, ZIP lookup, and map pins are locally maintained records.
- Leaflet displays OpenStreetMap map tiles.
- The map includes a national STEM/maker atlas layer imported from the provided resource files, with a 50-state selector and ZIP-to-state lookup.
- Funding search can optionally include live Grants.gov results through `/api/grants-gov`.
- Browser geolocation is used only after the user clicks **Use my location**.
- Location is used only in the browser to sort nearby local records.
- Listings include `sourceUrl`, `verifiedDate`, `isSample`, `dataStatus`, `serviceArea`, and `coordinatesApproximate`.
- Entries needing verification are visibly labeled and should be replaced with verified local data before final public use.

Future APIs should be added through the provider layer, not directly in page components:

- `src/services/resourceProvider.js`
- `src/services/grantProvider.js`
- `src/services/grantsGovProvider.js`
- `src/services/eventProvider.js`
- `src/services/geocodeProvider.js`
- `src/services/locationUtils.js`
- `src/services/apiStatus.js`

Potential future sources include 211, Google Places, OpenStreetMap/Nominatim, and Delaware/Maryland open data portals. Grants.gov live search is available through a Vercel serverless proxy and does not require an API key.

## Location Profiles

The app supports two selectable service areas:

- Middletown / New Castle County, Delaware
- TSA Nationals / National Harbor, Maryland

Profile files live in:

- `src/data/locationProfiles/middletownDE.js`
- `src/data/locationProfiles/nationalHarborMD.js`
- `src/data/locationProfiles/index.js`
- `src/data/locationLookup.js`
- `src/data/usStates.js`
- `src/data/nationalResources.js`
- `src/data/nationalFunding.js`

To customize for the actual school community, edit or add a profile with local resources, grants, events, citations, ZIP codes, and center coordinates.

## Accessibility Features

- Skip link
- Keyboard-friendly navigation and controls
- Visible focus states
- Large text mode
- High contrast mode
- Dark mode
- Reduced motion mode
- Labeled forms and controls
- Plain-language data and emergency disclaimers

## Known Limitations

- Data is curated/static unless a future provider is connected.
- Some entries are marked as needing verification before real-world use.
- Location search uses a local ZIP/city lookup, not internet geocoding.
- Grant deadlines, eligibility, hours, and service availability must be verified on official sources.
