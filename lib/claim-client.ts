import {Qualifiers, Relationship} from '@byu-oit/ts-claims-engine'
import Ajv from 'ajv'
import schema from './schemas/claim.json'

export interface PartialClaim {
    concept?: string
    relationship?: Relationship
    value?: string
    qualifier?: Qualifiers
}

export interface ClaimClientParams {
    concept?: string
    relationship?: Relationship
    value?: string
    qualifier?: Qualifiers
}

export class ClaimClient {
    public claim: PartialClaim = {}
    public valid = false

    private CONCEPT?: string
    private RELATIONSHIPS?: Relationship
    private VALUE?: string
    private QUALIFIER?: Qualifiers

    private validate = new Ajv().compile(schema)

    constructor(options: ClaimClientParams = {}) {
        const {concept, relationship, value, qualifier} = options
        if (concept) {
            this.concept(concept)
        }
        if (relationship) {
            this.relationship(relationship)
        }
        if (value) {
            this.value(value)
        }
        if (qualifier) {
            const qualifiers = Object.entries(qualifier)
            qualifiers.forEach(([key, val]) => {
                this.qualify(key, val)
            })
        }
        this.compile()
    }

    public concept (value: string): this {
        this.CONCEPT = value
        this.compile()
        return this
    }

    public relationship (value: Relationship): this {
        this.RELATIONSHIPS = value
        this.compile()
        return this
    }

    public value (value: string): this {
        this.VALUE = value
        this.compile()
        return this
    }

    public qualify (key: string, value: unknown): this {
        this.QUALIFIER = Object.assign(this.QUALIFIER || {}, {[key]: value})
        this.compile()
        return this
    }

    private compile (): void {
        this.claim = {
            ...this.CONCEPT && {concept: this.CONCEPT},
            ...this.RELATIONSHIPS && {relationship: this.RELATIONSHIPS},
            ...this.VALUE && {value: this.VALUE},
            ...this.QUALIFIER && {qualifier: this.QUALIFIER}
        }
        this.valid = this.validate(this.claim) as boolean
    }
}
export default ClaimClient
