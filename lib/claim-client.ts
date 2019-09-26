import {ClaimItem, Qualifiers, Relationship} from "@byu-oit/ts-claims-engine";

export default class ClaimClient {
    private _concept?: string;
    private _relationship?: Relationship;
    private _value?: string;
    private _qualifier?: Qualifiers;

    constructor(concept?: string, relationship?: Relationship, value?: string, qualifier?: Qualifiers) {
        if (concept) {
            this.concept(concept);
        }
        if (relationship) {
            this.relationship(relationship)
        }
        if (value) {
            this.value(value)
        }
        if (qualifier) {
            const qualifiers = Object.entries(qualifier);
            qualifiers.forEach(([key, value]) => {
                this.qualify(key, value)
            })
        }
    }

    public concept = (value: string): ClaimClient => {
        this._concept = value;
        return this;
    };

    public relationship = (value: Relationship): ClaimClient => {
        this._relationship = value;
        return this;
    };

    public value = (value: string): ClaimClient => {
        this._value = value;
        return this;
    };

    public qualify = (key: string, value: any): ClaimClient => {
        this._qualifier = Object.assign(this._qualifier || {}, {[key]: value});
        return this;
    };

    public format = (): ClaimItem => {
        if (!this._concept) {
            throw new Error(`Undefined concept in claim`);
        }
        if (!this._relationship) {
            throw new Error(`Undefined relationship in claim`);
        }
        if (!this._value) {
            throw new Error(`Undefined value in claim`);
        }

        return {
            concept: this._concept,
            relationship: this._relationship,
            value: this._value,
            ...this._qualifier && {qualifier: this._qualifier}
        };
    }
}
