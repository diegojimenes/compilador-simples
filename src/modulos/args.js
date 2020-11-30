let typesArgs = {
    'endereco': 'src',
    'estilo': 'style',
    'classe': 'class'
}

const pegarArgumentos = (tag) => {
    if (!tag) return null
    let params = tag.replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(', ', ',').split(' ').filter((b, i) => i != 0)
    return params.map((param) => {
        let splitParams = param.split('=')
        return { type: splitParams[0], value: [splitParams[1]] }
    })
}

const parseArgs = (arguments) => arguments.reduce((string, { type, value }) => {
    let stringValues = value[0] ? value[0] : ''
    let valores = stringValues.replace('"', '').replace('"', '').split(',')
    valores = valores.map((valor, i) => `${valor}${valores.length - 1 == i ? '' : '; '}`).join('')
    let arg = !typesArgs[type] ? '' : `${typesArgs[type]}="${valores}"`
    return `${string}${(string == '') && (arg == '') ? '' : ' '}${arg}`
}, '')

module.exports = { parseArgs, pegarArgumentos }