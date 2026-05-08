export const apiStatus = {
  dataLabel: "Curated local dataset",
  compact:
    "Curated local records - Map tiles by OpenStreetMap - Listings are locally maintained unless live data is connected.",
  current:
    "Current version uses curated local records. No 211, Google Places, Grants.gov, or live government API key is required.",
  map:
    "Leaflet renders OpenStreetMap map tiles. Resource pins come from local service-area data, not live place search.",
  geolocation:
    "Browser geolocation is only used when the user clicks Use my location, and it is used only in the browser to sort nearby local records.",
  futureApis: [
    "211 National Data Platform: best for social/community services, but requires developer access and authorization keys.",
    "Google Places API: good for place search/geocoding, but requires API key/billing and should be proxied through serverless functions.",
    "Grants.gov API: useful for federal grants, but not ideal for local school club sponsorships.",
    "OpenStreetMap/Nominatim: useful for geocoding, but public endpoints have usage limits and should not be hammered.",
    "Delaware/Maryland open data portals: possible dataset sources after specific datasets are selected."
  ]
};
