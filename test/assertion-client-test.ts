import {assert} from 'chai';
import Assertion from '../lib/assertion-client';
import {Claim} from "@byu-oit/ts-claims-engine";

describe('Assertion Client', () => {
    let ac: Assertion;

    beforeEach(() => {
        ac = new Assertion({id: '1'});
    });

    it('will instantiate an empty assertion with a random id', () => {
        const {assertion, valid} = new Assertion();
        assert.isFalse(valid);
        assert.isEmpty(assertion);
    });

    it('will fail to format a client missing a subject', () => {
        const {valid} = ac
            .claim(
                Assertion.claim({
                    concept: 'subject-exists',
                    relationship: 'eq',
                    value: 'John',
                    qualifier: {age: 43}
                })
            );
        assert.isFalse(valid);
    });

    it('will fail to format a client missing at least one claim', () => {
        const {valid} = ac
            .subject('123456789')
            .mode('any');
        assert.isFalse(valid);
    });

    it('will format a client after immediate completion of claim requisites', () => {
        const expected: Claim = {
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
        };
        const {assertion} = ac
            .subject('123456789')
            .mode('any')
            .claim(
                Assertion.claim({
                    concept: 'subject-exists',
                    relationship: 'eq',
                    value: 'John',
                    qualifier: {
                        age: 43
                    }
                })
            );
        assert.deepEqual(assertion, expected);
    });

    it('will format a client after eventual completion of claim requisites', () => {
        const expected: Claim = {
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
        };
        const {assertion} = ac.subject('123456789')
            .mode('any')
            .claim(
                Assertion.claim()
                    .concept('subject-exists')
                    .relationship('eq')
                    .value('John')
                    .qualify('age', 43)
            );
        assert.deepEqual(assertion, expected);
    });

    it('will format a client after immediate completion of assertion requisites', () => {
        const expected: Claim = {
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
        };
        const {assertion} = new Assertion({
            id: '1',
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
        });
        assert.deepEqual(assertion, expected);
    });
});
