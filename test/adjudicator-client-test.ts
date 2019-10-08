import {assert} from 'chai';
import AdjudicatorClient from '../lib/adjudicator-client';

describe('Adjudicator Client', () => {
    let ac: AdjudicatorClient;

    beforeEach(() => {
        ac = new AdjudicatorClient({id: '1'});
    });

    it('will instantiate an empty assertion with a random id', () => {
        const client = new AdjudicatorClient();
        assert.isFalse(client.validate());
        assert.isEmpty(client.assertion[client.id]);
    });

    it('will format a client missing a subject', () => {
        ac.claim(
                AdjudicatorClient.claim({
                    concept: 'subject-exists',
                    relationship: 'eq',
                    value: 'John',
                    qualifier: {age: 43}
                })
            );
        assert.isFalse(ac.validate());
    });

    it('will format a client missing at least one claim', () => {
        ac.subject('123456789')
            .mode('any');
        assert.isFalse(ac.validate());
    });

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
            );
        assert.isTrue(ac.validate());
    });

    it('will format a client after eventual completion of claim requisites', () => {
        ac.subject('123456789')
            .mode('any')
            .claim(
                AdjudicatorClient.claim()
                    .concept('subject-exists')
                    .relationship('eq')
                    .value('John')
                    .qualify('age', 43)
            );
        assert.isTrue(ac.validate());
    });

    it('will format a client after immediate completion of assertion requisites', () => {
        const client = new AdjudicatorClient({
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
        assert.isTrue(client.validate());
    });

    it('will join multiple adjudicators', () => {
        const assertion = AdjudicatorClient.join(
            ac.subject('123456789')
                .mode('any')
                .claim(
                    AdjudicatorClient.claim()
                        .concept('subject-exists')
                        .relationship('eq')
                        .value('John')
                        .qualify('age', 43)
                )
        );
        assert.isTrue(AdjudicatorClient.validate(assertion));
    });
});
