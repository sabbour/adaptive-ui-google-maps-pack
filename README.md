# @sabbour/adaptive-ui-google-maps-pack

An [Adaptive UI](https://github.com/sabbour/adaptive-ui-framework) component pack for **Google Maps** and **Google Places** integration. Embeds interactive maps, place search, nearby discovery with photos, and destination photo cards.

## Components

| Component | Props | Description |
|-----------|-------|-------------|
| `googleMaps` | `mode?`, `query?`, `origin?`, `destination?`, `center?`, `zoom?`, `mapType?`, `height?`, `waypoints?`, `travelMode?` | Embedded interactive Google Map. Supports modes: `place`, `search`, `directions`, `view`, `streetview`. |
| `googlePlacesSearch` | `query`, `bind`, `label?` | Searchable list of places from the Places API. User clicks to select a place. |
| `googleNearby` | `location`, `bind`, `placeType?`, `label?`, `maxResults?` | Visual grid of nearby places with photos, ratings, and price levels. Richer than `googlePlacesSearch`. |
| `googlePhotoCard` | `query`, `caption?`, `height?` | Photo card with place name, rating, and address overlay. Use as a hero image for destinations. |

## Tools

| Tool | Description |
|------|-------------|
| `google_places_search` | Search for places by text query. Returns name, address, rating, price level, and coordinates. |
| `google_place_details` | Get detailed info about a specific place by place ID. Returns hours, phone, website, and reviews. |
| `google_geocode` | Convert an address or place name to lat/lng coordinates. |

## Installation

```bash
npm install @sabbour/adaptive-ui-google-maps-pack
```

```typescript
import { createGoogleMapsPack } from '@sabbour/adaptive-ui-google-maps-pack';

const mapsPack = createGoogleMapsPack();
// Register with your AdaptiveApp
```

## Prerequisites

- A Google Maps API key with Places API and Maps Embed API enabled (configured via the settings panel or stored in `localStorage`)

## License

MIT
