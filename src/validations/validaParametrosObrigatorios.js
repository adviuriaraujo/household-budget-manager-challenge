const { ParametroInvalidoError } = require('../errors');

function verificaValoresValidos(valor, parametroObrigatorio) {
    const mensagemValorInvalido = `É necessário fornecer um valor válido para '${parametroObrigatorio}'!`;
    const valoresInvalidos = [null, undefined, ''];
    valoresInvalidos.forEach(valorInvalido => {
        if (valor === valorInvalido) throw new ParametroInvalidoError(mensagemValorInvalido);
    });
    switch (parametroObrigatorio) {
        case 'id':
            const regexIdValido = /^[0-9]+$/g
            if (typeof valor !== 'string' || !regexIdValido.test(valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
            break;
        case 'descricao':
            const regexStringValida = /^[A-Za-z0-9]+/g;
            if (typeof valor !== 'string' || !regexStringValida.test(valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
            valor = valor.toLowerCase();
            break;
        case 'valor':
            if (typeof valor !== 'number') throw new ParametroInvalidoError(mensagemValorInvalido);
            break;
        case 'data':
            const regexDataValida = /^[0-9]{4}-[01][0-9]-[0-3][0-9]$/g;
            if (typeof valor !== 'string' || !regexDataValida.test(valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
            break;
        case 'categoria':
            const categoriasPermitidas = [
                'Alimentação',
                'Saúde',
                'Moradia',
                'Transporte',
                'Educação',
                'Lazer',
                'Imprevistos',
                'Outras',
            ]
            if (!categoriasPermitidas.includes(valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
            break;
        default:
            break;
    }
}

function validaParametrosObrigatorios(parametros, parametrosObrigatorios) {
    parametrosObrigatorios.forEach(parametroObrigatorio => {
        if (!Object.prototype.hasOwnProperty.call(parametros, parametroObrigatorio)) {
            throw new ParametroInvalidoError(`O parâmetro '${parametroObrigatorio}' é obrigatório!`);
        }
        verificaValoresValidos(parametros[parametroObrigatorio], parametroObrigatorio);
    });
}

module.exports = { validaParametrosObrigatorios };
