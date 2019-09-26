import {Claims, Mode, Qualifiers, Relationship} from '@byu-oit/ts-claims-engine';
import ClaimClient from './claim-client'

export default class AssertionClient {
    public static claim(concept?: string, relationship?: Relationship, value?: string, qualifier?: Qualifiers) {
        return new ClaimClient(concept, relationship, value, qualifier);
    }

    public static join(...assertions: AssertionClient[]): Claims {
        return assertions.reduce((result, assertion) => {
            return Object.assign(result, assertion.format())
        }, {})
    }

    private _id: string;
    private _subject?: string;
    private _mode?: Mode;
    private _claims: ClaimClient[] = [];

    constructor(id: string, subject?: string, mode?: Mode, ...claims: ClaimClient[]) {
        this._id = id;
        if (subject) {
            this.subject(subject);
        }
        if (mode) {
            this.mode(mode);
        }
        if (claims.length) {
            this.assert(...claims)
        }
    }

    public subject = (value: string): AssertionClient => {
        this._subject = value;
        return this;
    };

    public mode = (value: Mode): AssertionClient => {
        this._mode = value;
        return this;
    };

    public assert = (...values: ClaimClient[]): AssertionClient => {
        this._claims = this._claims.concat(values);
        return this;
    };

    public format = (): Claims => {
        if (!this._subject) {
            throw new Error(`Undefined subject in assertion '${this._id}'`)
        }
        if (!this._claims.length) {
            throw new Error(`Empty claim in assertion '${this._id}'`)
        }

        return {
            [this._id]: {
                subject: this._subject,
                mode: this._mode || 'all',
                claims: this._claims.map(cc => cc.format())
            }
        }
    }
}
