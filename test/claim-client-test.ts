import {assert} from 'chai';
import ClaimClient from '../lib/claim-client';
import {ClaimItem} from "@byu-oit/ts-claims-engine";

describe('Claim Client', () => {
    let cc: ClaimClient;
    let flag: boolean;

    beforeEach(() => {
        cc = new ClaimClient();
        flag = true;
    });

    it('will fail to format a client missing a concept', () => {
        try {
            cc.relationship('eq')
                .value('John')
                .qualify('age', 43)
                .format();
            assert.isFalse(flag);
        } catch (e) {
            assert.equal(e.message, 'Undefined concept in claim');
        }
    });

    it('will fail to format a client missing a relationship', () => {
        try {
            cc.concept('subject-exists')
                .value('John')
                .qualify('age', 43)
                .format();
            assert.isFalse(flag);
        } catch (e) {
            assert.equal(e.message, 'Undefined relationship in claim');
        }
    });


    it('will fail to format a client missing a value', () => {
        try {
            cc.concept('subject-exists')
                .relationship('eq')
                .qualify('age', 43)
                .format();
            assert.isFalse(flag);
        } catch (e) {
            assert.equal(e.message, 'Undefined value in claim');
        }
    });

    it('will format a client without a qualifier', () => {
        const expected: ClaimItem = {
            concept: 'subject-exists',
            relationship: 'eq',
            value: 'John',
            qualifier: {
                age: 43
            }
        };
        const actual = cc.concept('subject-exists')
            .relationship('eq')
            .value('John')
            .qualify('age', 43)
            .format();
        assert.deepEqual(actual, expected);
    });

    it('will format a client with multiple qualifiers', () => {
        const expected: ClaimItem = {
            concept: 'subject-exists',
            relationship: 'eq',
            value: 'John',
            qualifier: {
                age: 43,
                height: 5.6
            }
        };
        const actual = cc.concept('subject-exists')
            .relationship('eq')
            .value('John')
            .qualify('age', 43)
            .qualify('height', 5.6)
            .format();
        assert.deepEqual(actual, expected);
    });
});
