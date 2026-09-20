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

export interface ApiSuccessResponse<T> {
	success: SuccessFlag;
	message?: string;
	data?: T;
}

export interface AllCompaniesResponse {
	success: SuccessFlag;
	results_count?: number;
	data?: CompanyListItem[];
	message?: string;
}

export interface SearchCompanyResponse {
	success: SuccessFlag;
	query?: string;
	results_count?: number;
	search_results?: SearchResult[];
	message?: string;
}

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
