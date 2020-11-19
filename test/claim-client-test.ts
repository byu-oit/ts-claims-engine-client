import {assert} from 'chai'
import Client from '../lib/claim-client'
import {ClaimItem, Relationships} from "@byu-oit/ts-claims-engine"

describe('Claim Client', () => {
    let client: Client

    beforeEach(() => {
        client = new Client()
    })

    it('will fail to format a client missing a concept', () => {
        const {valid} = client.relationship(Relationships.EQ)
            .value('John')
            .qualify('age', 43)
        assert.isFalse(valid)
    })

    it('will fail to format a client missing a relationship', () => {
            const {valid} = client.concept('subject-exists')
                .value('John')
                .qualify('age', 43)
            assert.isFalse(valid)
    })


    it('will fail to format a client missing a value', () => {
            const {valid} = client.concept('subject-exists')
                .relationship(Relationships.EQ)
                .qualify('age', 43)
            assert.isFalse(valid)
    })

    it('will format a client without a qualifier', () => {
        const expected: ClaimItem = {
            concept: 'subject-exists',
            relationship: Relationships.EQ,
            value: 'John',
            qualifier: {
                age: 43
            }
        }
        const {claim, valid} = client.concept('subject-exists')
            .relationship(Relationships.EQ)
            .value('John')
            .qualify('age', 43)
        assert.isTrue(valid)
        assert.deepEqual(claim, expected)
    })

    it('will format a client with multiple qualifiers', () => {
        const expected: ClaimItem = {
            concept: 'subject-exists',
            relationship: Relationships.EQ,
            value: 'John',
            qualifier: {
                age: 43,
                height: 5.6
            }
        }
        const {claim, valid} = client.concept('subject-exists')
            .relationship(Relationships.EQ)
            .value('John')
            .qualify('age', 43)
            .qualify('height', 5.6)
        assert.isTrue(valid)
        assert.deepEqual(claim, expected)
    })
})
