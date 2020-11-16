const path = require('path')
const fs = require('fs')

class Validator {
    RulesetPath
    Errors = {}
    Rules = {}

    constructor (options = {}) {
        if (options.rulesetPath) {
            this.SetRulesetPath(options.rulesetPath.trim())
        }

        this.InitRule()
    }

    InitRule () {
        const f = path.resolve(__dirname, 'rules.js')

        if (fs.existsSync(f)) {
            this.Rules = require(f)
        }
    }

    AppendRule (ruleName, fn) {
        this.Rules[ruleName] = fn
    }

    AppendRuleFromFile (ruleFileName) {
        if (fs.existsSync(ruleFileName)) {
            const newRules = require(ruleFileName)

            if (newRules && typeof newRules === 'object' && Object.keys(newRules).length) {
                Object.assign(this.Rules, newRules)
            }
        }
    }

    SetRulesetPath (rulesetPath) {
        if (typeof rulesetPath === 'string' && rulesetPath.length) {
            if (fs.existsSync(path.resolve(rulesetPath))) {
                this.RulesetPath = rulesetPath
            }
        }
    }

    GetRulesetPath () {
        const dirName = __dirname

        if (this.RulesetPath && typeof this.RulesetPath === 'string' && this.RulesetPath.length) {
            dirName = this.RulesetPath
        }

        return dirName
    }

    GetRuleset = rulesetName => {
        let ruleset = false

        if (rulesetName) {
            if (typeof rulesetName === 'string') {
                ruleset = this.GetRulesetFromFile(rulesetName)
            }
    
            if (typeof rulesetName === 'object' && Object.keys(rulesetName).length) {
                ruleset = rulesetName
            }    
        }

        return ruleset
    }

    GetRulesetFromFile = fileName => {
        let fName = String(fileName).trim().toLowerCase()

        if (!fName.length) {
            throw new Error(`Ruleset undefined`)
        }

        const exts = ['js', 'json', 'txt']
        const dirName = this.GetRulesetPath()
        
        let targetFilePath

        for (let i = 0; i < exts.length; i++) {
            let fullName = `${fName}.${exts[i]}`
            let fPath = path.resolve(path.join(dirName, fullName))

            if (fs.existsSync(fPath)) {
                targetFilePath = fPath

                break
            }
        }

        if (!targetFilePath) {
            throw new Error(`Ruleset file is not found`)
        }

        return require(targetFilePath)
    }

    Validate = async (ruleset, input = {}) => {
        if (!input) {
            input = {}
        }

        ruleset = this.GetRuleset(ruleset)

        if (!ruleset || typeof ruleset !== 'object') {
            throw new Error(`Invalid ruleset`)
        }

        for (let fieldName in ruleset) {
            const fieldRules = ruleset[fieldName]

            if (fieldRules && typeof fieldRules === 'object') {
                for (let ruleName in fieldRules) {
                    const fn = this.Rules[ruleName]
                    
                    if (!fn) {
                        throw new Error(`Rule ${ruleName} is not exist`)
                    }

                    const ruleValue = fieldRules[ruleName]

                    input = await fn(ruleValue, input, fieldName)
                }
            }
        }

        return input
    }
}

module.exports = Validator