import {assert} from 'chai';
import Assertions from '../lib/assertions-client';
import {Claims} from "@byu-oit/ts-claims-engine";

describe('Assertion Client', () => {
    let ac: Assertions;

    beforeEach(() => {
        ac = new Assertions();
    });

    it('will assert a new incomplete claim', () => {
        const {assertions, valid} = ac
            .assert()
            .subject('John');
        assert.isFalse(valid);
        assert.isNotEmpty(assertions);
    });

    it('will assert a new complete claim', () => {
        const expected: Claims = {
            '1': {
                subject: 'John',
                mode: 'all',
                claims: [
                    {
                        concept: 'subject-exists',
                        relationship: 'eq',
                        value: 'true',
                        qualifier: {
                            age: 43
                        }
                    }
                ]
            }
        };
        const {assertions, valid} = ac
            .assert('1')
            .subject('John')
            .mode('all')
            .claim(
                Assertions.claim()
                    .concept('subject-exists')
                    .relationship('eq')
                    .value('true')
                    .qualify('age', 43)
            );
        assert.isTrue(valid);
        assert.deepEqual(assertions, expected);
    });

    it('will create a new assertion during subject function if there is no current assertion', () => {
        const {assertions, valid} = ac
            .subject('John');
        assert.isFalse(valid);
        assert.isObject(assertions);
    });

    it('will create a new assertion during mode function if there is no current assertion', () => {
        const {assertions, valid} = ac
            .mode('any');
        assert.isFalse(valid);
        assert.isObject(assertions);
    });

    it('will create a new assertion during claims function if there is no current assertion', () => {
        const {assertions, valid} = ac
            .claim(
                Assertions.claim().concept('subject-exists').relationship('eq').value('true')
            );
        assert.isFalse(valid);
        assert.isObject(assertions);
    });

    it('Assertions client will recall a past assertion during assert function and modify it', () => {
        ac.assert('1').mode('any');
        ac.assert('1').claim(
            Assertions.claim().concept('subject-exists').relationship('eq').value('true')
        );
        ac.assert('1').subject('John');
        ac.assert('1').subject('Jane');
        assert.isTrue(ac.valid);
        assert.equal(Object.keys(ac.assertions).length, 1);
    })
});
