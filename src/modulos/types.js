var { parseArgs, pegarArgumentos } = require('./args');

const types = {
    'divisao': {
        html: '<div> ', type: 'block', parse: ({ arguments }) => {
            let args = parseArgs(arguments)
            return `<div${args}>`
        }, arguments: (tag) => pegarArgumentos(tag)
    },
    '*divisao': { html: '</div> ', type: 'close block', parse: () => '</div>', arguments: (tag) => pegarArgumentos(tag) },
    'paragrafo': {
        html: '<p>',
        type: 'block text',
        parse: ({ value, arguments }) => {
            let args = parseArgs(arguments)
            return `<p${args}>${value}</p>`
        },
        arguments: (tag) => pegarArgumentos(tag)
    },
    'imagem': {
        html: '<imagem> ',
        type: 'element',
        parse: ({ arguments }) => {
            let args = parseArgs(arguments)
            return `<img${args}/>`
        },
        arguments: (tag) => pegarArgumentos(tag)
    }
}

module.exports = types