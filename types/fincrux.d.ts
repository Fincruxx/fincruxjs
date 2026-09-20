export type HistoricalInterval =
	| '1minute'
	| '30minutes'
	| 'day'
	| 'week'
	| 'month';

export type MarketInterval = '1D' | '1M';

export type FIIDataType =
	| 'index_futures'
	| 'stock_futures'
	| 'index_options'
	| 'stock_options'
	| 'cash';

export type SuccessFlag = 'true' | 'false' | boolean;

export interface FincruxParams {
	api_key: string;
	root?: string;
	fetch?: typeof globalThis.fetch;
}

export interface CompanyListItem {
	name: string;
	trading_symbol: string;
}

export interface SearchResult {
	name: string;
	trading_symbol: string;
}

export type FinancialTable = string[][];

export interface TopRatios {
	ROE: string;
	ROCE: string;
	'Stock P/E': string;
	'Book Value': string;
	'Face Value': string;
	'High / Low': string;
	'Market Cap': string;
	'Current Price': string;
	'Dividend Yield': string;
}

export interface CompanyFinancialData {
	about: string;
	top_ratios: TopRatios;
	quaterly_results: FinancialTable;
	profit_and_loss: FinancialTable;
	balance_sheet: FinancialTable;
	cash_flows: FinancialTable;
	ratios: FinancialTable;
	shareholding_quarterly: FinancialTable;
	shareholding_yearly: FinancialTable;
	last_updated_at: string;
}

export interface GetCompanyFinancialsResponse {
	success: SuccessFlag;
	company: string;
	trading_symbol: string;
	data: CompanyFinancialData;
	message?: string;
}

export interface HistoricalCandle {
	time: string;
	open: number | string;
	high: number | string;
	low: number | string;
	close: number | string;
	volume: number | string;
}

export interface GetCompanyHistoricalsResponse {
	success: SuccessFlag;
	company?: string;
	data?: HistoricalCandle[];
	message?: string;
}

export interface MarketActivityRow {
	time_stamp: number;
	buy_amount: number;
	sell_amount: number;
	buy_contracts: number;
	sell_contracts: number;
	oi_contracts: number;
	oi_amount: number;
	total_long_contracts: number;
	total_short_contracts: number;
	total_call_long_contracts: number;
	total_put_long_contracts: number;
	total_call_short_contracts: number;
	total_put_short_contracts: number;
}

export type FIIActivityData = Partial<Record<FIIDataType, MarketActivityRow[]>>;

export interface GetHistoricalsOptions {
	interval?: HistoricalInterval;
	from_date?: string;
	to_date?: string;
}

export interface ForceUpdateOptions {
	force_update?: boolean;
}

export interface MarketQueryOptions {
	interval?: MarketInterval;
	from_date?: string;
	force_update?: boolean;
}

export declare class FincruxError extends Error {
	readonly status?: number;
	readonly body?: unknown;
	constructor(message: string, options?: { status?: number; body?: unknown });
}

export declare class Fincrux {
	api_key: string;
	root: string;
	readonly VALID_INTERVALS: readonly HistoricalInterval[];
	readonly VALID_MARKET_INTERVALS: readonly MarketInterval[];
	readonly VALID_FII_DATA_TYPES: readonly FIIDataType[];
	readonly VERSION: string;
	readonly PACKAGE_URL: string;

	constructor(params: FincruxParams);

	allCompanies(): Promise<CompanyListItem[]>;
	searchCompany(query: string): Promise<SearchResult[]>;
	getCompanyFinancials(
		company_trading_symbol: string,
	): Promise<GetCompanyFinancialsResponse>;
	getCompanyHistoricals(
		company_trading_symbol: string,
		options?: GetHistoricalsOptions,
	): Promise<HistoricalCandle[]>;
	getCorporateActions(
		company_trading_symbol: string,
		options?: ForceUpdateOptions,
	): Promise<unknown>;
	getCompetitors(
		company_trading_symbol: string,
		options?: ForceUpdateOptions,
	): Promise<unknown>;
	getFII(
		data_type: FIIDataType | FIIDataType[] | string,
		options?: MarketQueryOptions,
	): Promise<FIIActivityData>;
	getDII(options?: MarketQueryOptions): Promise<MarketActivityRow[]>;
}

export declare const VERSION: string;
export declare const DEFAULT_ROOT: string;
export declare const PACKAGE_URL: string;
export declare const VALID_INTERVALS: readonly HistoricalInterval[];
export declare const VALID_MARKET_INTERVALS: readonly MarketInterval[];
export declare const VALID_FII_DATA_TYPES: readonly FIIDataType[];
export declare const ROUTES: {
	readonly 'company.all': '/api/all_companies';
	readonly 'company.search': '/api/search/{query}';
	readonly 'company.financials': '/api/financials/{company_trading_symbol}';
	readonly 'company.historicals': '/api/historicals/{company_trading_symbol}';
	readonly 'company.corporate_actions': '/api/corporate-actions/{company_trading_symbol}';
	readonly 'company.competitors': '/api/competitors/{company_trading_symbol}';
	readonly 'market.fii': '/api/market/fii';
	readonly 'market.dii': '/api/market/dii';
};
