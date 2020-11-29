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

module.exports = analiseSintatica