# ts-claims-engine-client
[![Build Status](https://travis-ci.org/byu-oit/ts-claims-engine-client.svg?branch=master)](https://travis-ci.org/byu-oit/ts-claims-engine-client)
[![Coverage Status](https://coveralls.io/repos/github/byu-oit/ts-claims-engine-client/badge.svg?branch=master)](https://coveralls.io/github/byu-oit/ts-claims-engine-client?branch=master)
![GitHub package.json version](https://img.shields.io/github/package-json/v/byu-oit/ts-claims-engine-client)

## Installation
`npm i @byu-oit/ts-claims-engine-client`

## Introduction
The purpose of the Claims Adjudicator Client is to facilitate the formation of claims requests using functional syntax.

## Example
```ts
const CEC = require('@byu-oit/ts-claims-engine-client')
const client = new CEC()

client.subject('John')
    .mode('all')
    .claim(CEC.claim()
        .concept('subject-exists')
        .relationship('eq')
        .value('true')
        .qualify('age', 43))
		
const valid = client.validate() // True

console.log(JSON.stringify(client.assertion, null, 2))
```

:sparkles: Try it out with [RunKit on NPM](https://npm.runkit.com/@byu-oit/ts-claims-engine-client) :sparkles:

## API
Some of the parameters and return types are complex objects. Instead of listing them in the method definitions, they have been listed in the [Appendix](#appendix) under [API Reference](#api-reference).

### AdjudicatorClient
Creates a new instance of the AssertionsClient.
```ts
new AssertionsClient()
```

### Public Data Members
`id: string`: The ID of the assertion object.

`assertion: PartialAssertion`: The assertion object for making a claims request.

### Static Methods
`AdjudicatorClient.validate`: Provides programatic access to validate an assertion/claims object.
```ts
AdjudicatorClient.validate(assertion: any): boolean
```

`AdjudicatorClient.claim`: Provides programatic access to the ClaimClient class from the AdjudicatorClient.
```ts
AdjudicatorClient.claim(options?: ClaimClientParams): ClaimClient
```

`AdjudicatorClient.join`: Provides a method to join assertions together.
```ts
AdjudicatorClient.join(...assertions: AdjudicaatorClient): {[key: string]: PartialAssertion}
```

### Public Methods
`subject`: Adds `subject: [value]` to the assertion object.
```ts
subject(value: string): this
```

`mode`: Adds `mode: [value]` to the assertion object.
```ts
mode(value: 'all' | 'any' | 'one'): this
```

`claim`: Adds `claim: PartialClaim[]` (a claim or list of claims) to the assertion object.
```ts
claim(...values: Array<ClaimClient | ClaimItem>): this
```

`validate`: Validates the current object schema.
```ts
validate(): boolean
```


## Appendix

### API Reference
```ts
interface ClaimClientParams {
    concept?: string;
    relationship?: Relationship;
    value?: string;
    qualifier?: Qualifiers;
}

interface ClaimItem {
    concept: string;
    relationship: Relationship;
    value: string;
    qualifier?: Qualifiers;
}

type Mode = 'all' | 'any' | 'one';

interface PartialAssertion {
    [key: string]: {
        subject?: string;
        mode?: Mode;
        claims?: PartialClaim[];
    }
}

interface PartialClaim {
    concept?: string;
    relationship?: Relationship;
    value?: string;
    qualifier?: Qualifiers;
}

type Relationship = 'gt' | 'gt_or_eq' | 'lt' | 'lt_or_eq' | 'eq' | 'not_eq';

```

### Related Packages
* [Claims Adjudicator Module (CAM)](https://github.com/byu-oit/ts-claims-engine)
* [Claims Adjudicator Middleware](https://github.com/byu-oit/ts-claims-engine-middleware)
* [Claims Adjudicator Client](https://github.com/byu-oit/ts-claims-engine-client)
* [Claims Adjudicator WSO2 Request](https://github.com/byu-oit/ts-wso2-claims-request)
