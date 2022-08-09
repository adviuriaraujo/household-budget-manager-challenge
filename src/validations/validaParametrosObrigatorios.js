const { ParametroInvalidoError } = require('../errors');

function idInvalido(id) {
    if (typeof id !== 'string') return true;
    const regexIdValido = /^[0-9]+$/g
    if (!regexIdValido.test(id)) return true;
    return false;
}
function descricaoInvalida(descricao) {
    if (typeof descricao !== 'string') return true;
    const regexStringValida = /^[A-Za-z0-9]+/g;
    if (!regexStringValida.test(descricao)) return true;
    return false;
}
function dataInvalida(data) {
    if (typeof data !== 'string') return true;
    const regexDataValida = /^[0-9]{4}-[01][0-9]-[0-3][0-9]$/g;
    if (!regexDataValida.test(data)) return true;
    return false;
}
function anoInvalido(ano) {
    if (typeof ano !== 'string') return true;
    if (Number.isNaN(Number(ano))) return true;
    if (ano.length !== 4) return true;
    return false;
}
function mesInvalido(mes) {
    if (typeof mes !== 'string') return true;
    if (Number.isNaN(Number(mes))) return true;
    if (Number(mes) < 1 || Number(mes) > 12) return true;
    return false;
}

function verificaValoresValidos(valor, parametroObrigatorio) {
    const mensagemValorInvalido = `É necessário fornecer um valor válido para '${parametroObrigatorio}'!`;
    const valoresInvalidos = [null, undefined, ''];
    valoresInvalidos.forEach(valorInvalido => {
        if (valor === valorInvalido) throw new ParametroInvalidoError(mensagemValorInvalido);
    });
    switch (parametroObrigatorio) {
        case 'id':
            if (idInvalido(valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
            break;
        case 'descricao':
            if (descricaoInvalida(valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
            valor = valor.toLowerCase();
            break;
        case 'valor':
            if (typeof valor !== 'number') throw new ParametroInvalidoError(mensagemValorInvalido);
            break;
        case 'data':
            if (dataInvalida(valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
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
            ];
            if (!categoriasPermitidas.includes(valor)) throw new ParametroInvalidoError;(mensagemValorInvalido);
            break;
        case 'ano':
            if (anoInvalido(valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
            break;
        case 'mes':
            if (mesInvalido(valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
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
