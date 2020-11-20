import {assert} from 'chai'
import Client from '../lib/adjudicator-client'
import {PartialClaim} from '../lib/claim-client'
import {Mode, Relationship} from '@byu-oit/ts-claims-engine'

describe('Adjudicator Client', () => {
    let ac: Client
    const defaultId = '0'

    beforeEach(() => {
        ac = new Client().id(defaultId)
    })

    it('will instantiate an empty assertion with a random id', () => {
        const client = new Client()
        assert.isFalse(client.validate())
        assert.isEmpty(client.assertion()[client._id])
    })

    it('will format a client missing a subject', () => {
        ac.claim(
            Client.claim({
                concept: 'subject-exists',
                relationship: Relationship.EQ,
                value: 'John',
                qualifier: {age: 43}
            })
        )
        assert.isFalse(ac.validate())
    })

    it('will format a client missing at least one claim', () => {
        ac.subject('123456789')
            .mode(Mode.ANY)
        assert.isFalse(ac.validate())
    })

    it('will overwrite the claims while formatting the client', () => {
        const expected: PartialClaim[] = [
            {
                concept: 'subject-exists',
                relationship: Relationship.EQ,
                value: 'John',
                qualifier: {
                    age: 43
                }
            }
        ]
        ac.subject('123456789')
            .mode(Mode.ANY)
            .claim(
                Client.claim({
                    concept: 'subject-exists',
                    relationship: Relationship.EQ,
                    value: 'Johnny',
                    qualifier: {
                        age: 12
                    }
                })
            )
            .claims([
                Client.claim({
                    concept: 'subject-exists',
                    relationship: Relationship.EQ,
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
            .mode(Mode.ANY)
            .claim(
                Client.claim({
                    concept: 'subject-exists',
                    relationship: Relationship.EQ,
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
            .mode(Mode.ANY)
            .claim(
                Client.claim()
                    .concept('subject-exists')
                    .relationship(Relationship.EQ)
                    .value('John')
                    .qualify('age', 43)
            )
        assert.isTrue(ac.validate())
    })

    it('will format a client after immediate completion of assertion requisites', () => {
        const client = new Client({
            id: defaultId,
            subject: '123456789',
            mode: Mode.ANY,
            claims: [
                {
                    concept: 'subject-exists',
                    relationship: Relationship.EQ,
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
            .mode(Mode.ALL)
            .claim(Client.claim()
                .concept('subject-exists')
                .relationship(Relationship.EQ)
                .value('Johnny')
                .qualify('age', 12))
            .assertion()
        const second = ac.id('2')
            .subject('123456789')
            .mode(Mode.ANY)
            .claims([Client.claim()
                .concept('subject-exists')
                .relationship(Relationship.EQ)
                .value('John')
                .qualify('age', 43)])
            .assertion()
        const assertion = Client.join(first, second)
        assert.hasAllKeys(assertion, ['1', '2'])
        assert.isTrue(Client.validate(assertion))
    })

    it('will create distinct claims using the same client', () => {
        const first = ac.id('1')
            .subject('987654321')
            .mode(Mode.ALL)
            .claim(Client.claim()
                .concept('subject-exists')
                .relationship(Relationship.EQ)
                .value('Johnny')
                .qualify('age', 12))
            .assertion()
        const second = ac.id('2')
            .subject('123456789')
            .mode(Mode.ANY)
            .claims([Client.claim()
                .concept('subject-exists')
                .relationship(Relationship.EQ)
                .value('John')
                .qualify('age', 43)])
            .assertion()
        assert.notDeepEqual(first, second)
    })
})
