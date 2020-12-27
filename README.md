# spl_validator
A simple and extensible validator for Node.js.

## Installation
```bash
$ npm install --save spl_validator
```

## Usage
```js
const spl_validator = require('spl_validator')
const validator = new spl_validator()

try {
    let input =  {
        name: 'John Doe'
    };

    let ruleset = {
        name: { Required: true, MinLength: 5, MaxLength: 10 }
    }

    input = await validator.Validate(ruleset, input)

    console.log(input)
} catch (err) {
    console.error(err)
}
```

### Available Rules
| RuleName  |      Description                                                  |  Value            |
|-----------|-------------------------------------------------------------------|:-----------------:|
| Required  | Input must not empty                                              | boolean           |
| Email     | Input must be valid email address                                 | boolean           |
| MinLength | Input must have length greater or equal than the specified value  | integer           |
| MaxLength | Input must have length less or equal than the specified value     | integer           |
| Length    | Input must have length equal to the specified value               | integer           |
| EqualTo   | Input must have value equal to other input value                  | other input name  |
| Enum      | Input must have value equal to one of the specified value         | array of values   |
| Integer   | Input must have integer value                                     | boolean           |
| Min       | Input must have value greater or equal than specified value       | boolean           |
| Max       | Input must have value less or equal than specified value          | boolean           |
| Lowercase | Transform input to lowercase string                               | boolean           |
| Uppercase | Transform input to uppercase string                               | boolean           |
| Date      | Input must be a date string with given format                     | string            |


## Ruleset From File
You can also store the ruleset in a ```.json```, ```.js```, or ```.txt``` file.

### myruleset.json
```json
{
    "agree": {
        "Required": true,
        "Enum": ["yes", "no"]
    }
}

```

```js
const spl_validator = require('spl_validator')
const validator = new spl_validator()

try {
    let input =  {
        name: 'John Doe'
    };

    input = await validator.Validate('myruleset', input)

    console.log(input)
} catch (err) {
    console.error(err)
}
```
## Append Rule
You can also append new rule.
```js
const spl_validator = require('spl_validator')
const validator = new spl_validator()

try {
    let input =  {
        name: 'John Doe'
    };

    validator.AppendRule('Lowercase', async function (value, input, fieldName) {
        if (value === true) {
            input[fieldName] = String(input[fieldName]).toLowerCase()
        }

        return input
    })

    let ruleset = {
        name: { Required: true, Lowercase: true }
    }

    input = await validator.Validate(ruleset, input)

    console.log(input)
} catch (err) {
    console.error(err)
}
```

## Append Rule From File
You can also append a collection of rules in a ```.js``` file.
#### mynewrules.js
```js
const Rules = {}

Rules.Hide = async function (value, input, fieldName) {
    if (value === true) {
        var data = String(input[fieldName])

        input[fieldName] = data.substr(0, Math.ceil(data.length/2)) + String('*').repeat(Math.floor(data.length/2)) 
    }

    return input
}

module.exports = Rules
```

```js
const spl_validator = require('spl_validator')
const validator = new spl_validator()

try {
    let input =  {
        name: 'John Doe'
    };

    validator.AppendRuleFromFile('mynewrules.js')

    let ruleset = {
        name: { Required: true, Hide: true }
    }

    input = await validator.Validate(ruleset, input)

    console.log(input)
} catch (err) {
    console.error(err)
}
```