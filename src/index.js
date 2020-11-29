var gerador = require('./modulos/gerador');
var analiseSintatica = require('./modulos/analiseSintatica');
var analiseLexica = require('./modulos/analiseLexica');
var fs = require('fs');

const compile = (code) => {
    let lexa = analiseLexica(code)
    let sintatica = analiseSintatica(lexa)
    return gerador(sintatica)
}

fs.readFile('./src/teste.jhtml', 'utf8', function (err, data) {
    if (err) throw err;
    compile(data)
});

