const {AdjudicatorClient: CEC} = require('@byu-oit/ts-claims-engine-client')
const client = new CEC()

client.subject('John')
  .mode('all')
  .claim(CEC.claim()
    .concept('subject-exists')
    .relationship('eq')
    .value('true')
    .qualify('age', 43))

const valid = client.validate()

console.log('Is valid:', valid) // True
console.log(JSON.stringify(client.assertion(), null, 2)) // Assertions Object
