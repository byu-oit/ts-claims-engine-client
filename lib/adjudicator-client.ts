import {ClaimItem, Mode} from '@byu-oit/ts-claims-engine';
import Ajv from 'ajv';
import uuid from 'uuid';
import {ClaimClient, ClaimClientParams, PartialClaim} from './claim-client';
import schema from './schemas/assertion.json';

export interface PartialAssertion {
    [key: string]: {
        subject?: string;
        mode?: Mode;
        claims?: PartialClaim[];
    };
}

export interface AssertionClientParams {
    id?: string;
    subject?: string;
    mode?: Mode;
    claims?: Array<ClaimClient | ClaimItem>;
}

export class AdjudicatorClient {
    public static jsonSchema = schema;

    public static validate = (assertion: any) => {
        return new Ajv().compile(schema)(assertion);
    };

    public static claim = (options?: ClaimClientParams) => {
        return new ClaimClient(options);
    };

    public static join = (...assertions: AdjudicatorClient[]) => {
        return assertions.reduce((result, current) => {
            return Object.assign(result, current.assertion());
        }, {});
    };

    private static resolveClaimItems = (value: ClaimClient | ClaimItem): ClaimClient => {
        return value instanceof ClaimClient ? value : new ClaimClient(value);
    };

    public _id: string;

    private _subject?: string;
    private _mode?: Mode;
    private _claims: ClaimClient[] = [];

    constructor(options: AssertionClientParams = {}) {
        const {id, subject, mode, claims} = options;
        this._id = id || uuid();
        if (subject) {
            this.subject(subject);
        }
        if (mode) {
            this.mode(mode);
        }
        if (claims) {
            this.claim(...claims);
        }
    }

    public id = (value: string) => {
        this._id = value;
        return this;
    };

    public subject = (value: string) => {
        this._subject = value;
        return this;
    };

    public mode = (value: Mode) => {
        this._mode = value;
        return this;
    };

    public claim = (...values: Array<ClaimClient | ClaimItem>) => {
        this._claims = this._claims.concat(values.map(AdjudicatorClient.resolveClaimItems));
        return this;
    };

    public claims = (values: Array<ClaimClient | ClaimItem>) => {
        this._claims = this._claims = values.map(AdjudicatorClient.resolveClaimItems);
        return this;
    };

    public validate = () => AdjudicatorClient.validate(this.assertion());

    public assertion = (): PartialAssertion => {
        return {
            [this._id]: {
                ...this._subject && {subject: this._subject},
                ...this._mode && {mode: this._mode},
                ...this._claims.length && {claims: this._claims.map(({claim}) => claim)}
            }
        };
    };
}
