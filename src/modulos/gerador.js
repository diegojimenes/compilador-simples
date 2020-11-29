var fs = require('fs');

const gerador = (sintica) => {
    var stream = fs.createWriteStream("./build/my_file.html");
    stream.once('open', function (fd) {
        sintica.map(({ body }) => {
            stream.write(`${body.parse(body)}\n`);
        })
        stream.end(() => console.log('complete'));
    });
}

module.exports = gerador