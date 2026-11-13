# The Fincrux API TypeScript/JavaScript Client

The official TypeScript/JavaScript client for communicating with the [Fincrux API](https://fincrux.org).

Fincrux exposes REST APIs for company fundamentals, filings, news, historical candles, corporate actions, peer competitors, and FII/DII market activity.

Licensed under the MIT License.

## Documentation

- [Fincrux HTTP API documentation](https://fincrux.org)

## Requirements

- NodeJS v18.0.0+

## Installation

Install via [npm](https://www.npmjs.com/package/fincrux)

```
npm install fincrux@latest
```

Or via [yarn](https://yarnpkg.com/package/fincrux)

```
yarn add fincrux
```

## Getting started with API

```typescript
import { Fincrux } from "fincrux";

const apiKey = "your_api_key";

const fc = new Fincrux({ api_key: apiKey });

async function init() {
  try {
    await search();
    await financials();
    await fii();
  } catch (err) {
    console.error(err);
  }
}

async function search() {
  try {
    const results = await fc.searchCompany("reliance");
    console.log("Search:", results);
  } catch (err) {
    console.error("Error searching:", err);
  }
}

async function financials() {
  try {
    const data = await fc.getCompanyFinancials("RELIANCE");
    console.log("Financials:", data.company, data.data?.top_ratios);

    const consolidated = await fc.getCompanyFinancials("RELIANCE", {
      statement_type: "consolidated",
    });
    console.log("Consolidated:", consolidated.data?.statement_type);

    const filings = await fc.getCompanyFilings("RELIANCE");
    console.log("Filings:", filings.announcements, filings.annual_reports);

    const news = await fc.getCompanyNews("RELIANCE", { page_size: 10 });
    console.log("News:", news.data);
  } catch (err) {
    console.error("Error getting financials:", err);
  }
}

async function fii() {
  try {
    const activity = await fc.getFII(["cash", "index_futures"], {
      interval: "1D",
    });
    console.log("FII:", activity);

    const dii = await fc.getDII({ interval: "1D" });
    console.log("DII:", dii);
  } catch (err) {
    console.error("Error getting market activity:", err);
  }
}

init();
```

## API methods

| Method | Description |
| --- | --- |
| `allCompanies()` | List all companies |
| `searchCompany(query)` | Search companies by name |
| `getCompanyFinancials(symbol, options?)` | Financial statements and ratios (`standalone` or `consolidated`) |
| `getCompanyFilings(symbol, options?)` | Recent announcements and annual reports with source links |
| `getCompanyNews(symbol, options?)` | Paginated company news |
| `getCompanyHistoricals(symbol, options?)` | OHLC candles |
| `getCorporateActions(symbol, options?)` | Corporate actions |
| `getCompetitors(symbol, options?)` | Peer competitors |
| `getFII(data_type, options?)` | FII cash / F&O activity |
| `getDII(options?)` | DII cash activity |

### Historical intervals

`1minute`, `30minutes`, `day`, `week`, `month`

### Statement types

`standalone`, `consolidated`

### Filings

`getCompanyFilings` returns `announcements` (latest 5) and `annual_reports`, each with the original filing `url` and `published_at`. `is_revised` is derived from the filing title.

### News

`getCompanyNews` accepts `{ page_number, page_size }` (both 1-100) and returns `data` plus pagination `metadata`.

### FII / DII intervals

`1D`, `1M`

### FII data types

`index_futures`, `stock_futures`, `index_options`, `stock_options`, `cash`

## Run unit tests

```
npm run test
```

## Lint and format

```
npm run check
npm run format
```

## Generate documentation

```
npm install typedoc --save-dev
npx typedoc --out ./docs
```

## Changelog

Check [CHANGELOG.md](./CHANGELOG.md)
