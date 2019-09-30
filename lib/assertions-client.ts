import {Mode} from '@byu-oit/ts-claims-engine';
import Ajv, {ErrorObject} from 'ajv';
import uuid from 'uuid';
import AssertionClient, {PartialAssertion} from './assertion-client';
import ClaimClient, {ClaimClientParams} from './claim-client';
import schema from './schemas/assertions.json';

export default class AssertionsClient {
    public static claim(options?: ClaimClientParams) {
        return new ClaimClient(options);
    }

    public assertions: { [key: string]: PartialAssertion } = {};
    public valid: boolean = false;
    public errors: ErrorObject[] | null | undefined;

    private CURRENT?: AssertionClient;
    private ASSERTIONS: { [key: string]: AssertionClient} = {};

    private ajv = new Ajv();
    private validate = this.ajv.compile(schema);

    public assert = (assertionId?: string): AssertionsClient => {
        if (assertionId && this.assertions[assertionId]) {
            const {subject, mode, claims} = this.assertions[assertionId];
            this.CURRENT = new AssertionClient({
                id: assertionId,
                ...subject && {subject},
                ...mode && {mode},
                ...claims && {claims: claims.map(claim => {
                    return AssertionClient.claim(claim);
                })}
            });
        } else {
            this.CURRENT = new AssertionClient({id: assertionId || uuid()});
        }
        this.compile();
        return this;
    };
    public subject = (value: string): AssertionsClient => {
        if (this.CURRENT === undefined) {
            this.CURRENT = new AssertionClient({id: uuid()});
        }
        this.CURRENT.subject(value);
        this.compile();
        return this;
    };

    public mode = (value: Mode): AssertionsClient => {
        if (this.CURRENT === undefined) {
            this.CURRENT = new AssertionClient({id: uuid()});
        }
        this.CURRENT.mode(value);
        this.compile();
        return this;
    };

    public claim = (...values: ClaimClient[]): AssertionsClient => {
        if (this.CURRENT === undefined) {
            this.CURRENT = new AssertionClient({id: uuid()});
        }
        this.CURRENT.claim(...values);
        this.compile();
        return this;
    };

    private compile = (): void => {
        if (this.CURRENT) {
            this.ASSERTIONS[this.CURRENT.id] = this.CURRENT;
            this.assertions[this.CURRENT.id] = this.CURRENT.assertion;
        }
        this.valid = this.validate(this.assertions) as boolean;
        this.errors = this.validate.errors;
    };
}
