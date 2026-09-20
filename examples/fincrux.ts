import { Fincrux } from '../dist/lib';

const apiKey = process.env.FINCRUX_API_KEY || 'your_api_key';

const fc = new Fincrux({ api_key: apiKey });

async function init() {
	try {
		await search();
		await financials();
		await historicals();
		await fii();
		await dii();
	} catch (err) {
		console.error(err);
	}
}

async function search() {
	const results = await fc.searchCompany('reliance');
	console.log('Search:', results.slice(0, 5));
}

async function financials() {
	const data = await fc.getCompanyFinancials('RELIANCE');
	console.log('Company:', data.company);
	console.log('Top ratios:', data.data?.top_ratios);
}

async function historicals() {
	const candles = await fc.getCompanyHistoricals('RELIANCE', {
		interval: 'day',
		from_date: '2024-01-01',
		to_date: '2024-01-31',
	});
	console.log('Historicals:', candles?.slice(0, 3));
}

async function fii() {
	const activity = await fc.getFII(['cash', 'index_futures'], {
		interval: '1D',
	});
	console.log('FII:', activity);
}

async function dii() {
	const activity = await fc.getDII({ interval: '1D' });
	console.log('DII:', activity.slice(0, 3));
}

init();
