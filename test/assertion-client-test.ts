import {assert} from 'chai';
import Assertion from '../lib/assertion-client';
import {Claims} from "@byu-oit/ts-claims-engine";

describe('Assertion Client', () => {
    let ac: Assertion;
    let flag: boolean;

    beforeEach(() => {
        ac = new Assertion('1');
        flag = true;
    });

    it('will fail to format a client missing a subject', () => {
        try {
            ac.mode('any')
                .assert(
                    Assertion.claim('subject-exists', 'eq', 'John', {age: 43})
                )
                .format();
            assert.isFalse(flag);
        } catch (e) {
            assert.isTrue(flag);
        }
    });

    it('will fail to format a client missing at least one claim', () => {
        try {
            ac.subject('123456789')
                .mode('any')
                .format();
            assert.isFalse(flag);
        } catch (e) {
            assert.isTrue(flag);
        }
    });

    it('will default mode to \'all\' when the client is missing a mode', () => {
        const expected: Claims = {
            '1': {
                subject: '123456789',
                mode: 'all',
                claims: [
                    {
                        concept: 'subject-exists',
                        relationship: 'eq',
                        value: 'John',
                        qualifier: {
                            age: 43
                        }
                    }
                ]
            }
        };
        const actual = ac.subject('123456789')
            .assert(
                Assertion.claim('subject-exists', 'eq', 'John', {age: 43})
            )
            .format();
        assert.deepEqual(actual, expected);
    });

    it('will format a client after immediate completion of claim requisites', () => {
        const expected: Claims = {
            '1': {
                subject: '123456789',
                mode: 'any',
                claims: [
                    {
                        concept: 'subject-exists',
                        relationship: 'eq',
                        value: 'John',
                        qualifier: {
                            age: 43
                        }
                    }
                ]
            }
        };
        const actual = ac.subject('123456789')
            .mode('any')
            .assert(
                Assertion.claim('subject-exists', 'eq', 'John', {age: 43})
            )
            .format();
        assert.deepEqual(actual, expected);
    });

    it('will format a client after eventual completion of claim requisites', () => {
        const expected: Claims = {
            '1': {
                subject: '123456789',
                mode: 'any',
                claims: [
                    {
                        concept: 'subject-exists',
                        relationship: 'eq',
                        value: 'John',
                        qualifier: {
                            age: 43
                        }
                    }
                ]
            }
        };
        const actual = ac.subject('123456789')
            .mode('any')
            .assert(
                Assertion.claim()
                    .concept('subject-exists')
                    .relationship('eq')
                    .value('John')
                    .qualify('age', 43)
            )
            .format();
        assert.deepEqual(actual, expected);
    });

    it('will format a client after immediate completion of assertion requisites', () => {
        const expected: Claims = {
            '1': {
                subject: '123456789',
                mode: 'any',
                claims: [
                    {
                        concept: 'subject-exists',
                        relationship: 'eq',
                        value: 'John',
                        qualifier: {
                            age: 43
                        }
                    }
                ]
            }
        };
        const actual = new Assertion('1', '123456789', 'any',
            Assertion.claim()
                .concept('subject-exists')
                .relationship('eq')
                .value('John')
                .qualify('age', 43)
        ).format();
        assert.deepEqual(actual, expected);
    });



    it('will join multiple assertions together', () => {
        const expected: Claims = {
            '1': {
                subject: '123456789',
                mode: 'any',
                claims: [
                    {
                        concept: 'subject-exists',
                        relationship: 'eq',
                        value: 'John',
                        qualifier: {
                            age: 43
                        }
                    }
                ]
            },
            '2': {
                subject: '123456789',
                mode: 'any',
                claims: [
                    {
                        concept: 'subject-exists',
                        relationship: 'eq',
                        value: 'Jane',
                        qualifier: {
                            age: 41
                        }
                    }
                ]
            }
        };
        const actual = Assertion.join(
            new Assertion('1', '123456789', 'any',
                Assertion.claim()
                    .concept('subject-exists')
                    .relationship('eq')
                    .value('John')
                    .qualify('age', 43)
            ),
            new Assertion('2', '123456789', 'any',
                Assertion.claim()
                    .concept('subject-exists')
                    .relationship('eq')
                    .value('Jane')
                    .qualify('age', 41)
            )
        );
        assert.deepEqual(actual, expected);
    })
});
