const { ParametroInvalidoError } = require('../errors');

function verificaValoresValidos(valor, parametroObrigatorio) {
    const mensagemValorInvalido = `É necessário fornecer um valor válido para '${parametroObrigatorio}'!`;
    const valoresInvalidosGerais = [null, undefined, ''];
    if (valoresInvalidosGerais.includes(valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
    const valoresInvalidosDoParametro = {
        'id': (id) => {
            if (isNaN(id)) return true;
            const regexIdValido = /^[0-9]+$/g
            if (!regexIdValido.test(id)) return true;
            return false;
        },
        'descricao': (descricao) => {
            if (typeof descricao !== 'string') return true;
            const regexStringValida = /^[A-Za-z0-9]+/g;
            if (!regexStringValida.test(descricao)) return true;
            return false;
        },
        'valor': (valor) => {
            if (typeof valor !== 'number') return true;
            return false;
        },
        'data': (data) => {
            const regexDataValida = /^[0-9]{4}-[01][0-9]-[0-3][0-9]$/g;
            if (!regexDataValida.test(data)) return true;
            return false;
        },
        'categoria': (categoria) => {
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
            if (!categoriasPermitidas.includes(categoria)) return true;
            return false;
        },
        'ano': (ano) => {
            if (isNaN(ano)) return true;
            if (ano.length !== 4) return true;
            return false;  
        },
        'mes': (mes) => {
            if (Number.isNaN(Number(mes))) return true;
            if (Number(mes) < 1 || Number(mes) > 12) return true;
            return false;
        },
        'nome': (nome) => {
            if (nome.length < 2) return true;
            return false
        },
    };
    if (valoresInvalidosDoParametro[parametroObrigatorio](valor)) throw new ParametroInvalidoError(mensagemValorInvalido);
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
