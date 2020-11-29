var types = require('./types');

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

module.exports = analiseLexica