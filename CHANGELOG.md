# Changelog

## [0.2.0] - 2026-11-14

### Added

- `getCompanyFilings(symbol, options?)` for recent announcements and annual reports, including original filing links, publication timestamps, and a title-derived `is_revised` flag
- `getCompanyNews(symbol, options?)` for paginated company news
- `statement_type` option on `getCompanyFinancials` (`standalone` by default, or `consolidated`)
- `VALID_STATEMENT_TYPES` export

### Changed

- `getCompanyFinancials` now accepts an optional second argument

## [0.1.0] - 2026-09-21

### Added

- Initial TypeScript/JavaScript client for the Fincrux API
- Company list, search, financials, historicals, corporate actions, and competitors
- `getFII` and `getDII` market activity methods
- Biome for linting and formatting
