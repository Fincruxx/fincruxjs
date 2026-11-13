export const DEFAULT_ROOT = 'https://api.fincrux.org';
export const PACKAGE_URL = 'https://fincrux.org';
export const VERSION = '0.2.0';

export const VALID_INTERVALS = [
	'1minute',
	'30minutes',
	'day',
	'week',
	'month',
] as const;

export const VALID_MARKET_INTERVALS = ['1D', '1M'] as const;

export const VALID_STATEMENT_TYPES = ['standalone', 'consolidated'] as const;

export const VALID_FII_DATA_TYPES = [
	'index_futures',
	'stock_futures',
	'index_options',
	'stock_options',
	'cash',
] as const;

export const ROUTES = {
	'company.all': '/api/all_companies',
	'company.search': '/api/search/{query}',
	'company.financials': '/api/financials/{company_trading_symbol}',
	'company.filings': '/api/filings/{company_trading_symbol}',
	'company.news': '/api/news/{company_trading_symbol}',
	'company.historicals': '/api/historicals/{company_trading_symbol}',
	'company.corporate_actions':
		'/api/corporate-actions/{company_trading_symbol}',
	'company.competitors': '/api/competitors/{company_trading_symbol}',
	'market.fii': '/api/market/fii',
	'market.dii': '/api/market/dii',
} as const;
