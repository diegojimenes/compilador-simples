var fs = require('fs');

let typesArgs = {
    'endereco': 'src'
}

let types = {
    'divisao': { html: '<div> ', type: 'block', parse: () => '<div>', arguments: () => null },
    '*divisao': { html: '</div> ', type: 'close block', parse: () => '</div>', arguments: () => null },
    'paragrafo': {
        html: '<p>',
        type: 'block text',
        parse: ({ value }) => {
            return `<p>${value}</p>`
        },
        arguments: () => null
    },
    'imagem': {
        html: '<imagem> ',
        type: 'element',
        parse: ({ arguments }) => {
            let args = arguments.reduce((string, { type, value }) => {
                return `${string} ${typesArgs[type]}=${value}`
            }, '')
            return `<img${args}/>`
        },
        arguments: (tag) => {
            if (!tag) return null
            let params = tag.split(' ').filter((b, i) => i != 0)
            return params.map((param) => {
                let splitParams = param.split('=')
                return { type: splitParams[0], value: splitParams[1] }
            })
        }
    }
}

const analiseLexica = (code) => {
    let split = code.split(';').map((b) => b.replace('\n', '')).filter((b) => b.length > 0)
    return split.map((b) => {
        let firstWord = b.split(' ')[0]
        if (!types[firstWord.trim()]) firstWord = 'paragrafo'
        return { type: types[firstWord.trim()].type, value: b, arguments: types[firstWord.trim()].arguments, parse: types[firstWord.trim()].parse }
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
    var stream = fs.createWriteStream("my_file.html");
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

fs.readFile('./src/teste.jsHtml', 'utf8', function(err, data) {
    if (err) throw err;
    compile(data)
});

