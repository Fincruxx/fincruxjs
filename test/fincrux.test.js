'use strict';

const assert = require('assert');
const { Fincrux, FincruxError, VALID_INTERVALS } = require('../dist/lib');

describe('Fincrux', function () {
	it('requires api_key', function () {
		assert.throws(
			() => new Fincrux({}),
			(err) => err instanceof FincruxError,
		);
	});

	it('exposes valid intervals', function () {
		const fc = new Fincrux({ api_key: 'test' });
		assert.ok(fc.VALID_INTERVALS.includes('day'));
		assert.deepStrictEqual([...VALID_INTERVALS], [...fc.VALID_INTERVALS]);
	});

	it('rejects invalid historical interval', async function () {
		const fc = new Fincrux({ api_key: 'test' });
		await assert.rejects(
			() =>
				fc.getCompanyHistoricals('RELIANCE', {
					interval: 'invalid',
				}),
			(err) => err instanceof FincruxError,
		);
	});

	it('rejects invalid FII data_type', async function () {
		const fc = new Fincrux({ api_key: 'test' });
		await assert.rejects(
			() => fc.getFII('not_a_type'),
			(err) => err instanceof FincruxError,
		);
	});

	it('rejects invalid statement_type', async function () {
		const fc = new Fincrux({ api_key: 'test' });
		await assert.rejects(
			() =>
				fc.getCompanyFinancials('RELIANCE', {
					statement_type: 'invalid',
				}),
			(err) => err instanceof FincruxError,
		);
	});

	it('sends statement_type and reads filings/news routes', async function () {
		const calls = [];
		const fetchMock = async (url) => {
			calls.push(String(url));
			if (String(url).includes('/filings/')) {
				return {
					ok: true,
					status: 200,
					statusText: 'OK',
					text: async () =>
						JSON.stringify({
							success: 'true',
							data: {
								announcements: [],
								annual_reports: [],
								fetched_at: '2026-11-14T00:00:00',
							},
						}),
				};
			}
			if (String(url).includes('/news/')) {
				return {
					ok: true,
					status: 200,
					statusText: 'OK',
					text: async () =>
						JSON.stringify({
							company: 'Reliance',
							trading_symbol: 'RELIANCE',
							instrument_key: 'NSE_EQ|INE002A01018',
							data: [],
							metadata: {
								page: {
									page_number: 2,
									page_size: 10,
									total_records: 0,
									total_pages: 0,
								},
							},
							fetched_at: null,
						}),
				};
			}
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				text: async () =>
					JSON.stringify({
						success: 'true',
						company: 'Reliance',
						trading_symbol: 'RELIANCE',
						data: { statement_type: 'consolidated' },
					}),
			};
		};

		const fc = new Fincrux({ api_key: 'test', fetch: fetchMock });
		await fc.getCompanyFinancials('RELIANCE', {
			statement_type: 'consolidated',
		});
		await fc.getCompanyFilings('RELIANCE');
		const news = await fc.getCompanyNews('RELIANCE', {
			page_number: 2,
			page_size: 10,
		});

		assert.ok(calls[0].includes('statement_type=consolidated'));
		assert.ok(calls[1].includes('/api/filings/RELIANCE'));
		assert.ok(calls[2].includes('page_number=2'));
		assert.ok(calls[2].includes('page_size=10'));
		assert.strictEqual(news.metadata.page.page_number, 2);
	});
});
