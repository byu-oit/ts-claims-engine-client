import {assert} from 'chai';
import {ClaimClient} from '../lib/claim-client';
import {ClaimItem} from "@byu-oit/ts-claims-engine";

describe('Claim Client', () => {
    let cc: ClaimClient;

    beforeEach(() => {
        cc = new ClaimClient();
    });

    it('will fail to format a client missing a concept', () => {
        const {valid} = cc.relationship('eq')
            .value('John')
            .qualify('age', 43);
        assert.isFalse(valid);
    });

    it('will fail to format a client missing a relationship', () => {
            const {valid} = cc.concept('subject-exists')
                .value('John')
                .qualify('age', 43);
            assert.isFalse(valid);
    });


    it('will fail to format a client missing a value', () => {
            const {valid} = cc.concept('subject-exists')
                .relationship('eq')
                .qualify('age', 43);
            assert.isFalse(valid);
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
        const {claim, valid} = cc.concept('subject-exists')
            .relationship('eq')
            .value('John')
            .qualify('age', 43);
        assert.isTrue(valid);
        assert.deepEqual(claim, expected);
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
        const {claim, valid} = cc.concept('subject-exists')
            .relationship('eq')
            .value('John')
            .qualify('age', 43)
            .qualify('height', 5.6);
        assert.isTrue(valid);
        assert.deepEqual(claim, expected);
    });
});
