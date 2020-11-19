import {assert} from 'chai'
import {AdjudicatorClient} from '../lib/adjudicator-client'
import {PartialClaim} from "../lib/claim-client"

describe('Adjudicator Client', () => {
    let ac: AdjudicatorClient
    const defaultId = '0'

    beforeEach(() => {
        ac = new AdjudicatorClient().id(defaultId)
    })

    it('will instantiate an empty assertion with a random id', () => {
        const client = new AdjudicatorClient()
        assert.isFalse(client.validate())
        assert.isEmpty(client.assertion()[client._id])
    })

    it('will format a client missing a subject', () => {
        ac.claim(
            AdjudicatorClient.claim({
                concept: 'subject-exists',
                relationship: 'eq',
                value: 'John',
                qualifier: {age: 43}
            })
        )
        assert.isFalse(ac.validate())
    })

    it('will format a client missing at least one claim', () => {
        ac.subject('123456789')
            .mode('any')
        assert.isFalse(ac.validate())
    })

    it('will overwrite the claims while formatting the client', () => {
        const expected: PartialClaim[] = [
            {
                concept: 'subject-exists',
                relationship: 'eq',
                value: 'John',
                qualifier: {
                    age: 43
                }
            }
        ]
        ac.subject('123456789')
            .mode('any')
            .claim(
                AdjudicatorClient.claim({
                    concept: 'subject-exists',
                    relationship: 'eq',
                    value: 'Johnny',
                    qualifier: {
                        age: 12
                    }
                })
            )
            .claims([
                AdjudicatorClient.claim({
                    concept: 'subject-exists',
                    relationship: 'eq',
                    value: 'John',
                    qualifier: {
                        age: 43
                    }
                })
            ])
        assert.isTrue(ac.validate())
        assert.deepEqual(ac.assertion()['0'].claims, expected)
    })

    it('will format a client after immediate completion of claim requisites', () => {
        ac.subject('123456789')
            .mode('any')
            .claim(
                AdjudicatorClient.claim({
                    concept: 'subject-exists',
                    relationship: 'eq',
                    value: 'John',
                    qualifier: {
                        age: 43
                    }
                })
            )
        assert.isTrue(ac.validate())
    })

    it('will format a client after eventual completion of claim requisites', () => {
        ac.subject('123456789')
            .mode('any')
            .claim(
                AdjudicatorClient.claim()
                    .concept('subject-exists')
                    .relationship('eq')
                    .value('John')
                    .qualify('age', 43)
            )
        assert.isTrue(ac.validate())
    })

    it('will format a client after immediate completion of assertion requisites', () => {
        const client = new AdjudicatorClient({
            id: defaultId,
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
        })
        assert.isTrue(client.validate())
    })

    it('will join multiple claims', () => {
        const first = ac.id('1')
            .subject('987654321')
            .mode('all')
            .claim(AdjudicatorClient.claim()
                .concept('subject-exists')
                .relationship('eq')
                .value('Johnny')
                .qualify('age', 12))
            .assertion()
        const second = ac.id('2')
            .subject('123456789')
            .mode('any')
            .claims([AdjudicatorClient.claim()
                .concept('subject-exists')
                .relationship('eq')
                .value('John')
                .qualify('age', 43)])
            .assertion()
        const assertion = AdjudicatorClient.join(first, second)
        assert.hasAllKeys(assertion, ['1', '2'])
        assert.isTrue(AdjudicatorClient.validate(assertion))
    })

    it('will create distinct claims using the same client', () => {
        const first = ac.id('1')
            .subject('987654321')
            .mode('all')
            .claim(AdjudicatorClient.claim()
                .concept('subject-exists')
                .relationship('eq')
                .value('Johnny')
                .qualify('age', 12))
            .assertion()
        const second = ac.id('2')
            .subject('123456789')
            .mode('any')
            .claims([AdjudicatorClient.claim()
                .concept('subject-exists')
                .relationship('eq')
                .value('John')
                .qualify('age', 43)])
            .assertion()
        assert.notDeepEqual(first, second)
    })
})
