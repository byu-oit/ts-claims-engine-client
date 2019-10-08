# ts-claims-engine-client
##### Claims engine client
[![Build Status](https://travis-ci.org/byu-oit/ts-claims-engine-client.svg?branch=master)](https://travis-ci.org/byu-oit/ts-claims-engine-client)
[![Coverage Status](https://coveralls.io/repos/github/byu-oit/ts-claims-engine-client/badge.svg?branch=master)](https://coveralls.io/github/byu-oit/ts-claims-engine-client?branch=master)
![GitHub package.json version](https://img.shields.io/github/package-json/v/byu-oit/ts-claims-engine-client)

## Installation
`npm i @byu-oit/ts-claims-engine-client`

## Introduction
The purpose of the Claims Adjudicator Client is to facilitate the formation of claims requests using functional syntax.

:sparkles: ![View TypeDocs](https://byu-oit.github.io/ts-claims-engine-client/) :sparkles:

## Example
```js
const AssertionsClient = require('@byu-oit/ts-claims-engine-client')
const ac = new AssertionsClient()

const {assertions, valid} = ac
    .assert()
        .subject('John')
        .mode('all')
        .claim(
            AssertionsClient.claim()
                .concept('subject-exists')
                .relationship('eq')
                .value('true')
                .qualify('age', 43)
        );
```

## Related Packages
* ![Claims Adjudicator Module (CAM)](https://github.com/byu-oit/ts-claims-engine)
* ![Claims Adjudicator Middleware](https://github.com/byu-oit/ts-claims-engine-middleware)
* ![Claims Adjudicator Client](https://github.com/byu-oit/ts-claims-engine-client)
* ![Claims Adjudicator WSO2 Request](https://github.com/byu-oit/ts-wso2-claims-request)
