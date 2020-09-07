const { js, from } = require('../codegen')

const comment = require('./comment')
const { VariableType } = require('../enum')
const { UnrecognizedError } = require('../error')

function variable(name, item) {
  return [note(item), logic(name, item)].filter((item) => item).join(`\n`)
}

function note(item) {
  if (item.comment) {
    return comment(item.comment)
  } else {
    return null
  }
}

function logic(name, { type, expression }) {
  switch (type) {
    case VariableType.JSONPath:
      return jsonPath({ name, expression })

    case VariableType.Regex:
      return regex({ name, expression })

    case VariableType.CSSSelector:
      return cssSelector({ name, expression })

    default:
      throw new UnrecognizedError(
        { name: 'UnrecognizedVariableType' },
        `Unrecognized variable type: ${type}`
      )
  }
}

const jsonPath = js`
  vars[${from('name')}] = jsonpath.query(response.json(), ${from(
  'expression'
)})[0]
`

const regex = js`
  match = new RegExp(${from('expression')})
    .exec(response.body)

  vars[${from('name')}] = match ? match[1] || match[0] : null
`

const cssSelector = js`
  vars[${from('name')}] = response.html()
    .find(${from('expression')})
    .map((idx, el) => el.attr("value"))[0]
`

module.exports = variable
