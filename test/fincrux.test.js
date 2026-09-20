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
});
