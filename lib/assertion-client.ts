import {ClaimItem, Mode} from '@byu-oit/ts-claims-engine';
import Ajv from 'ajv';
import uuid from 'uuid';
import ClaimClient, {ClaimClientParams, PartialClaim} from './claim-client';
import schema from './schemas/assertion.json';

export interface PartialAssertion {
    subject?: string;
    mode?: Mode;
    claims?: PartialClaim[];
}

export interface AssertionClientParams {
    id?: string;
    subject?: string;
    mode?: Mode;
    claims?: Array<ClaimClient | ClaimItem>;
}

export default class AssertionClient {
    public static claim(options?: ClaimClientParams) {
        return new ClaimClient(options);
    }

    public id: string;
    public assertion: PartialAssertion = {};
    public valid: boolean = false;

    private SUBJECT?: string;
    private MODE?: Mode;
    private CLAIMS?: ClaimClient[];

    private validate = new Ajv().compile(schema);

    constructor(options: AssertionClientParams = {}) {
        const {id, subject, mode, claims} = options;
        this.id = id || uuid();
        if (subject) { this.subject(subject); }
        if (mode) { this.mode(mode); }
        if (claims) { this.claim(...claims); }
        this.compile();
    }

    public subject = (value: string): AssertionClient => {
        this.SUBJECT = value;
        this.compile();
        return this;
    };

    public mode = (value: Mode): AssertionClient => {
        this.MODE = value;
        this.compile();
        return this;
    };

    public claim = (...values: Array<ClaimClient | ClaimItem>): AssertionClient => {
        if (!this.CLAIMS) this.CLAIMS = [];
        this.CLAIMS = this.CLAIMS.concat(values.map(value => value instanceof ClaimClient ? value : new ClaimClient(value)));
        this.compile();
        return this;
    };

    private compile = (): void => {
        this.assertion = {
            ...this.SUBJECT && {subject: this.SUBJECT},
            ...this.MODE && {mode: this.MODE},
            ...this.CLAIMS && {claims: this.CLAIMS.map(({claim}) => claim)}
        };
        this.valid = this.validate(this.assertion) as boolean;
    };
}
