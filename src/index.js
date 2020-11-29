var fs = require('fs');

let typesArgs = {
    'endereco': 'src',
    'estilo': 'style'
}

const pegarArgumentos = (tag) => {
    if (!tag) return null
    let params = tag.replace(', ', ',').split(' ').filter((b, i) => i != 0)
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

let types = {
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

let tagsQueNaoPrecisamSerFechadas = {
    imagem: true,
    paragrafo: true
}

let errosTags = { Aberta: false, tag: '', linha: 0 }

const catchErroInTags = (firstWord, linha) => {
    if (!firstWord.includes('*') && errosTags.Aberta == false && !tagsQueNaoPrecisamSerFechadas[firstWord]) {
        errosTags.Aberta = true
        errosTags.tag = firstWord
        errosTags.linha = linha
    } else if (firstWord.includes('*')) {
        errosTags.Aberta = false
        errosTags.tag = firstWord
        errosTags.linha = linha
    } else if (!firstWord.includes('*') && errosTags.Aberta == true && !tagsQueNaoPrecisamSerFechadas[firstWord]) {
        throw `${errosTags.tag} na linha ${errosTags.linha} deve ser fechada`
    }
}
const analiseLexica = (code) => {
    let split = code.split(';').map((b) => b.replace('\n', '')).filter((b) => b.length > 0)
    return split.map((b, linha) => {
        let firstWord = b.split(' ')[0].trim()
        if (!types[firstWord]) firstWord = 'paragrafo'
        catchErroInTags(firstWord, linha)
        return { type: types[firstWord].type, value: b, arguments: types[firstWord].arguments, parse: types[firstWord].parse }
    })
}

const analiseSintatica = (lexa) => {
    return lexa.map(({ type, value, arguments, parse }) => {
        return {
            type,
            body: {
                type: type,
                name: value.split(' ')[0],
                arguments: arguments(value),
                value,
                parse
            }
        }
    })
}
const gerador = (sintica) => {
    var stream = fs.createWriteStream("./build/my_file.html");
    stream.once('open', function (fd) {
        sintica.map(({ body }) => {
            stream.write(`${body.parse(body)}\n`);
        })
        stream.end();
    });
}

const compile = (code) => {
    let lexa = analiseLexica(code)
    let sintatica = analiseSintatica(lexa)
    return gerador(sintatica)
}

fs.readFile('./src/teste.jsHtml', 'utf8', function (err, data) {
    if (err) throw err;
    compile(data)
});

