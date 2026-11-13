import {
	DEFAULT_ROOT,
	PACKAGE_URL,
	ROUTES,
	VALID_FII_DATA_TYPES,
	VALID_INTERVALS,
	VALID_MARKET_INTERVALS,
	VALID_STATEMENT_TYPES,
	VERSION,
} from '../constants';
import type {
	AllCompaniesResponse,
	ApiSuccessResponse,
	CompanyFilingsData,
	CompanyListItem,
	FIIActivityData,
	FIIDataType,
	FincruxParams,
	ForceUpdateOptions,
	GetCompanyFilingsResponse,
	GetCompanyFinancialsResponse,
	GetCompanyHistoricalsResponse,
	GetCompanyNewsResponse,
	GetHistoricalsOptions,
	HistoricalInterval,
	MarketActivityRow,
	MarketInterval,
	MarketQueryOptions,
	NewsOptions,
	SearchCompanyResponse,
	SearchResult,
	StatementOptions,
	StatementType,
} from '../interfaces';
import { cleanParams, FincruxError, isSuccess, messageFromBody } from './utils';

/**
 * @classdesc API client for the Fincrux REST API.
 *
 * Getting started
 * ---------------
 * ~~~~
 * import { Fincrux } from 'fincrux';
 *
 * const fc = new Fincrux({ api_key: 'your_api_key' });
 *
 * async function init() {
 *   try {
 *     const companies = await fc.allCompanies();
 *     console.log(companies.slice(0, 5));
 *   } catch (err) {
 *     console.error(err);
 *   }
 * }
 * init();
 * ~~~~
 *
 * @constructor
 * @name Fincrux
 * @param {Object} params Init params.
 * @param {string} params.api_key API key issued to you.
 * @param {string} [params.root='https://api.fincrux.org'] API end point root.
 * @param {function} [params.fetch] Optional fetch implementation.
 */
export class Fincrux {
	api_key: string;
	root: string;
	private readonly _fetch: typeof globalThis.fetch;

	readonly VALID_INTERVALS = VALID_INTERVALS;
	readonly VALID_MARKET_INTERVALS = VALID_MARKET_INTERVALS;
	readonly VALID_STATEMENT_TYPES = VALID_STATEMENT_TYPES;
	readonly VALID_FII_DATA_TYPES = VALID_FII_DATA_TYPES;
	readonly VERSION = VERSION;
	readonly PACKAGE_URL = PACKAGE_URL;

	constructor(params: FincruxParams) {
		if (!params?.api_key) {
			throw new FincruxError('api_key is required');
		}
		this.api_key = params.api_key;
		this.root = (params.root ?? DEFAULT_ROOT).replace(/\/+$/, '');
		this._fetch = params.fetch ?? globalThis.fetch.bind(globalThis);
	}

	/**
	 * Fetches a list of all companies.
	 */
	async allCompanies(): Promise<CompanyListItem[]> {
		const response = await this._get<AllCompaniesResponse>('company.all');
		return response.data ?? [];
	}

	/**
	 * Searches for companies by name.
	 * @param query Company name or fragment to search for.
	 */
	async searchCompany(query: string): Promise<SearchResult[]> {
		const response = await this._get<SearchCompanyResponse>('company.search', {
			query,
		});
		return response.search_results ?? [];
	}

	/**
	 * Fetches financial statements and ratios for a company.
	 * @param company_trading_symbol NSE trading symbol.
	 * @param options Statement type (`standalone` by default).
	 */
	async getCompanyFinancials(
		company_trading_symbol: string,
		options: StatementOptions = {},
	): Promise<GetCompanyFinancialsResponse> {
		const statement_type: StatementType =
			options.statement_type ?? 'standalone';
		if (
			!(VALID_STATEMENT_TYPES as readonly string[]).includes(statement_type)
		) {
			throw new FincruxError(
				`Invalid statement_type. Choose from: ${VALID_STATEMENT_TYPES.join(', ')}`,
			);
		}

		return this._get<GetCompanyFinancialsResponse>(
			'company.financials',
			{ company_trading_symbol },
			{ statement_type },
		);
	}

	/**
	 * Fetches recent announcements and annual reports for a company.
	 * @param company_trading_symbol NSE trading symbol.
	 * @param options Optional force_update flag.
	 */
	async getCompanyFilings(
		company_trading_symbol: string,
		options: ForceUpdateOptions = {},
	): Promise<CompanyFilingsData> {
		const response = await this._get<GetCompanyFilingsResponse>(
			'company.filings',
			{ company_trading_symbol },
			{ force_update: options.force_update ?? false },
		);

		if (isSuccess(response.success)) {
			return response.data;
		}
		throw new FincruxError(
			messageFromBody(response, 'Failed to fetch filings'),
			{ body: response },
		);
	}

	/**
	 * Fetches recent news articles for a company.
	 * @param company_trading_symbol NSE trading symbol.
	 * @param options Page number and page size.
	 */
	async getCompanyNews(
		company_trading_symbol: string,
		options: NewsOptions = {},
	): Promise<GetCompanyNewsResponse> {
		const response = await this._get<GetCompanyNewsResponse>(
			'company.news',
			{ company_trading_symbol },
			{
				page_number: options.page_number ?? 1,
				page_size: options.page_size ?? 20,
			},
		);

		if (Array.isArray(response.data)) {
			return response;
		}
		throw new FincruxError(messageFromBody(response, 'Failed to fetch news'), {
			body: response,
		});
	}

	/**
	 * Fetches OHLC historical candles for a company.
	 * @param company_trading_symbol NSE trading symbol.
	 * @param options Candle interval and date range.
	 */
	async getCompanyHistoricals(
		company_trading_symbol: string,
		options: GetHistoricalsOptions = {},
	): Promise<GetCompanyHistoricalsResponse['data']> {
		const interval: HistoricalInterval = options.interval ?? 'day';
		if (!(VALID_INTERVALS as readonly string[]).includes(interval)) {
			throw new FincruxError(
				`Invalid interval. Choose from: ${VALID_INTERVALS.join(', ')}`,
			);
		}

		const response = await this._get<GetCompanyHistoricalsResponse>(
			'company.historicals',
			{ company_trading_symbol },
			{
				interval,
				from_date: options.from_date,
				to_date: options.to_date,
			},
		);

		if (isSuccess(response.success)) {
			return response.data ?? [];
		}
		throw new FincruxError(
			messageFromBody(response, 'Failed to fetch historicals'),
			{ body: response },
		);
	}

	/**
	 * Fetches corporate actions for a company.
	 * @param company_trading_symbol NSE trading symbol.
	 * @param options Optional force_update flag.
	 */
	async getCorporateActions(
		company_trading_symbol: string,
		options: ForceUpdateOptions = {},
	): Promise<unknown> {
		const response = await this._get<ApiSuccessResponse<unknown>>(
			'company.corporate_actions',
			{ company_trading_symbol },
			{ force_update: options.force_update ?? false },
		);

		if (isSuccess(response.success)) {
			return response.data ?? response;
		}
		throw new FincruxError(
			messageFromBody(response, 'Failed to fetch corporate actions'),
			{ body: response },
		);
	}

	/**
	 * Fetches peer competitors for a company.
	 * @param company_trading_symbol NSE trading symbol.
	 * @param options Optional force_update flag.
	 */
	async getCompetitors(
		company_trading_symbol: string,
		options: ForceUpdateOptions = {},
	): Promise<unknown> {
		const response = await this._get<ApiSuccessResponse<unknown>>(
			'company.competitors',
			{ company_trading_symbol },
			{ force_update: options.force_update ?? false },
		);

		if (isSuccess(response.success)) {
			return response.data ?? response;
		}
		throw new FincruxError(
			messageFromBody(response, 'Failed to fetch competitors'),
			{ body: response },
		);
	}

	/**
	 * Fetches FII activity for NSE cash and F&amp;O segments.
	 * @param data_type One or more of index_futures, stock_futures,
	 *   index_options, stock_options, cash.
	 * @param options Interval, from_date, and force_update.
	 */
	async getFII(
		data_type: FIIDataType | FIIDataType[] | string,
		options: MarketQueryOptions = {},
	): Promise<FIIActivityData> {
		const interval: MarketInterval = options.interval ?? '1D';
		if (!(VALID_MARKET_INTERVALS as readonly string[]).includes(interval)) {
			throw new FincruxError(
				`Invalid interval. Choose from: ${VALID_MARKET_INTERVALS.join(', ')}`,
			);
		}

		const types = this._normalizeFIIDataTypes(data_type);
		for (const item of types) {
			if (!(VALID_FII_DATA_TYPES as readonly string[]).includes(item)) {
				throw new FincruxError(
					`Invalid data_type "${item}". Choose from: ${VALID_FII_DATA_TYPES.join(', ')}`,
				);
			}
		}

		const response = await this._get<ApiSuccessResponse<FIIActivityData>>(
			'market.fii',
			undefined,
			{
				data_type: types.join(','),
				interval,
				from: options.from_date,
				force_update: options.force_update ?? false,
			},
		);

		if (isSuccess(response.success)) {
			return response.data ?? {};
		}
		throw new FincruxError(
			messageFromBody(response, 'Failed to fetch FII activity'),
			{ body: response },
		);
	}

	/**
	 * Fetches DII activity for NSE cash segment.
	 * @param options Interval, from_date, and force_update.
	 */
	async getDII(options: MarketQueryOptions = {}): Promise<MarketActivityRow[]> {
		const interval: MarketInterval = options.interval ?? '1D';
		if (!(VALID_MARKET_INTERVALS as readonly string[]).includes(interval)) {
			throw new FincruxError(
				`Invalid interval. Choose from: ${VALID_MARKET_INTERVALS.join(', ')}`,
			);
		}

		const response = await this._get<ApiSuccessResponse<MarketActivityRow[]>>(
			'market.dii',
			undefined,
			{
				interval,
				from: options.from_date,
				force_update: options.force_update ?? false,
			},
		);

		if (isSuccess(response.success)) {
			return response.data ?? [];
		}
		throw new FincruxError(
			messageFromBody(response, 'Failed to fetch DII activity'),
			{ body: response },
		);
	}

	private _normalizeFIIDataTypes(
		data_type: FIIDataType | FIIDataType[] | string,
	): string[] {
		if (Array.isArray(data_type)) {
			return data_type
				.map((item) => String(item).trim().toLowerCase())
				.filter(Boolean);
		}
		return String(data_type)
			.split(',')
			.map((part) => part.trim().toLowerCase())
			.filter(Boolean);
	}

	private async _get<T>(
		route: keyof typeof ROUTES,
		urlArgs?: Record<string, string>,
		params?: Record<string, string | number | boolean | null | undefined>,
	): Promise<T> {
		let path: string = ROUTES[route];
		if (urlArgs) {
			for (const [key, value] of Object.entries(urlArgs)) {
				path = path.replace(`{${key}}`, encodeURIComponent(value));
			}
		}

		const query = cleanParams({
			api_key: this.api_key,
			...params,
		});
		const url = new URL(`${this.root}${path}`);
		if (query) {
			for (const [key, value] of Object.entries(query)) {
				url.searchParams.set(key, value);
			}
		}

		const response = await this._fetch(url.toString(), {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'User-Agent': `fincruxjs/${VERSION}`,
			},
		});

		let body: unknown;
		const text = await response.text();
		try {
			body = text ? JSON.parse(text) : null;
		} catch {
			body = text;
		}

		if (!response.ok) {
			throw new FincruxError(
				messageFromBody(body, `HTTP ${response.status} ${response.statusText}`),
				{ status: response.status, body },
			);
		}

		return body as T;
	}
}
