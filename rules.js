const Rules = {}

Rules.IsEmpty = value => {
    if (value === undefined || value === null) {
        return true
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
        value = String(value).trim()

        if (!value.length) {
            return true
        }

        return false
    }

    if (Array.isArray(value)) {
        if (!value.length) {
            return true
        }

        return false
    }

    if (typeof value === 'object') {
        const objKeys = Object.keys(value)

        if (Array.isArray(objKeys) && !objKeys.length) {
            return true
        }

        return false
    }

    return false
}

Rules.Required =  async (value, input, fieldName) => {
    if (true === value) {
        const fieldValue = input[fieldName]

        if (Rules.IsEmpty(fieldValue)) {
            throw new Error(`${fieldName} is required.`)
        }
    }

    return input
}

Rules.Email =  async (value, input, fieldName) => {
    if (true === value) {
        const fieldValue = input[fieldName]
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!Rules.IsEmpty(fieldValue) && !pattern.test(fieldValue)) {
            throw new Error(`${fieldName} is not valid email address.`)
        }
    }

    return input
}

Rules.MinLength = async (value, input, fieldName) => {
    value = Number(value)

    if (value < 0) {
        value = 0
    }
    
    const fieldValue = input[fieldName] ? String(input[fieldName]).trim() : undefined

    if (!Rules.IsEmpty(fieldValue) && fieldValue.length < value) {
        throw new Error(`minimum length of ${fieldName} is ${value}`)
    }

    return input
}

Rules.MaxLength = async (value, input, fieldName) => {
    value = Number(value)

    if (value < 0) {
        value = 0
    }
    
    const fieldValue = input[fieldName] ? String(input[fieldName]).trim() : undefined

    if (!Rules.IsEmpty(fieldValue) && fieldValue.length > value) {
        throw new Error(`maximum length of ${fieldName} is ${value}`)
    }

    return input
}

Rules.Length = async (value, input, fieldName) => {
    value = Number(value)

    if (value < 0) {
        value = 0
    }
    
    const fieldValue = input[fieldName] ? String(input[fieldName]).trim() : undefined

    if (!Rules.IsEmpty(fieldValue) && fieldValue.length != value) {
        throw new Error(`${fieldName} length must be ${value}`)
    }

    return input
}

Rules.EqualTo = async (value, input, fieldName) => {
    const fieldValue = input[fieldName] ? String(input[fieldName]).trim() : undefined
    
    if (!Rules.IsEmpty(fieldValue)) {
        value = String(value.trim())

        const encounterFieldValue = String(input[value]).trim()

        if (fieldValue !== encounterFieldValue) {
            throw new Error(`${fieldName} is not equal with ${value}`)
        }    
    }
    
    return input
}

Rules.Enum = async (value, input, fieldName) => {
    const fieldValue = input[fieldName] ? String(input[fieldName]).trim() : undefined
    
    if (!Rules.IsEmpty(fieldValue)) {
        if (!Array.isArray(value)) {
            value = []
        }
        
        if (value.indexOf(fieldValue) < 0) {
            throw new Error(`${fieldName} is must be one of ${value.join(', ')}`)
        }    
    }
    
    return input
}

Rules.Integer = async (value, input, fieldName) => {
    if (true === value) {
        let fieldValue = String(input[fieldName]).trim()
        
        if (isNaN(fieldValue)) {
            throw new Error(`${fieldName} must be an integer number`)
        }

        fieldValue = Number(fieldValue)

        if (!Number.isInteger(fieldValue)) {
            throw new Error(`${fieldName} must be an integer number`)
        }
    }

    return input
}

Rules.Min = async (value, input, fieldName) => {
    let fieldValue = input[fieldName] ? String(input[fieldName]).trim() : undefined

    if (!Rules.IsEmpty(fieldValue)) {
        if (isNaN(fieldValue)) {
            throw new Error(`${fieldName} value must be a number`)
        }

        fieldValue = Number(fieldValue)

        if (!isNaN(value)) {
            value = Number(value)

            if (fieldValue < value) {
                throw new Error(`${fieldName} value must be greater than ${value}`)
            }
        }    
    }

    return input
}

Rules.Max = async (value, input, fieldName) => {
    let fieldValue = input[fieldName] ? String(input[fieldName]).trim() : undefined

    if (!Rules.IsEmpty(fieldValue)) {
        if (isNaN(fieldValue)) {
            throw new Error(`${fieldName} value must be a number`)
        }

        fieldValue = Number(fieldValue)

        if (!isNaN(value)) {
            value = Number(value)

            if (fieldValue > value) {
                throw new Error(`${fieldName} value must be less than ${value}`)
            }
        }    
    }

    return input
}

Rules.Lowercase = async (value, input, fieldName) => {
    if (true === value) {
        let fieldValue = String(input[fieldName]).toLowerCase()

        input[fieldName] = fieldValue
    }

    return input
}

Rules.Uppercase = async (value, input, fieldName) => {
    if (true === value) {
        let fieldValue = String(input[fieldName]).toUpperCase()

        input[fieldName] = fieldValue
    }

    return input
}

Rules.Date = async (value, input, fieldName) => {
    let fieldValue = input[fieldName] ? String(input[fieldName]).trim() : undefined

    if (!Rules.IsEmpty(value) && !Rules.IsEmpty(fieldValue)) {
        const { DateTime } = require('luxon')
        const dateObj = DateTime.fromFormat(fieldValue, value)

        if (!dateObj.isValid || dateObj.toFormat(value) !== fieldValue) {
            throw new Error(`${fieldName} value must be a date with format ${value}`)
        }
    }

    return input
}

Rules.RegEx = async (value, input, fieldName) => {
    let fieldValue = input[fieldName] ? String(input[fieldName]).trim() : undefined

    if (!Rules.IsEmpty(value) && !Rules.IsEmpty(fieldValue)) {
        const pattern = new RegExp(value)

        if (!pattern.test(fieldValue)) {
            throw new Error(`${fieldName} value must be in ${value} format`)
        }
    }

    return input
}

module.exports = Rules