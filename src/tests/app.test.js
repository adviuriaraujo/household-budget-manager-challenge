const request = require('supertest');
const app = require('../app');
const { Model } = require('sequelize');

jest.mock('../../node_modules/sequelize/lib/model.js');

//*************************************** TESTES ROTAS RECEITAS ***************************************//
describe('GET /receitas', () => {
    it('retorna array com receitas', async () => {
        const receitasCadastradas = [
            { descricao: 'mock1', valor: 1, data: '2105-11-03' },
            { descricao: 'mock2', valor: 2, data: '2105-11-03' },
        ];
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve(receitasCadastradas));
        const res = await request(app)
            .get('/receitas');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        if (res.body.length > 0) {
            res.body.forEach(receita => {
                expect(receita).toMatchObject({
                    descricao: expect.any(String),
                    valor: expect.any(Number),
                    data: expect.any(String),
                });
            });
        }
    });
    it('deve retornar receitas cuja descrição contenham os parâmetros de busca', async () => {
        const receita1 = { descricao: 'mock1', valor: 1, data: '2105-11-03' };
        const receita2 = { descricao: 'mock2', valor: 2, data: '2105-11-03' };
        const receitasSimilares = [receita1, receita2];
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve(receitasSimilares));
        const res = await request(app)
            .get('/receitas?descricao=mock');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        if (res.body.length > 0) {
            res.body.forEach(receita => {
                expect(receita).toMatchObject({
                    descricao: expect.any(String),
                    valor: expect.any(Number),
                    data: expect.any(String),
                });
                expect(receita.descricao).toMatch(/mock/g);
            });
        }
    });
    it('retorna erro interno se ocorrer erro inesperado na busca de receitas', async () => {
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.reject(new Error()));
        const res = await request(app)
            .get('/receitas');
        expect(res.statusCode).toBe(500);
        expect(res.body.mensagem).toBe('Erro interno do servidor');
    });
});

describe('GET /receitas/:ano/:mes', () => {
    it('retorna array com receitas de um mês', async () => {
        const receitasNoMes = [
            { descricao: 'mock1', valor: 1, data: '2105-11-03' },
            { descricao: 'mock2', valor: 2, data: '2105-11-03' },
        ];
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve(receitasNoMes));
        const ano = '2015';
        const mes = '11'
        const res = await request(app)
            .get(`/receitas/${ano}/${mes}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        if (res.body.length > 0) {
            res.body.forEach(receita => {
                expect(receita).toMatchObject({
                    descricao: expect.any(String),
                    valor: expect.any(Number),
                    data: expect.any(String),
                });
            });
        }
    });
    test.each([
        [null, '08', 'ano'],
        ['erro', '08', 'ano'],
        ['92', '08', 'ano'],
        ['2022', null, 'mes'],
        ['2022', 'erro', 'mes'],
        ['2022', '0', 'mes'],
        ['2022', '13', 'mes']
    ]) (
        'deve retornar mensagem de parâmetro inválido para ano ou mês inválidos na busca de receitas',
        async (ano, mes, parametroObrigatorio) => {
            const mensagemErro = `É necessário fornecer um valor válido para '${parametroObrigatorio}'!`
            const res = await request(app)
                .get(`/receitas/${ano}/${mes}`);
            expect(res.statusCode).toBe(400);
            expect(res.body.erro).toBe('ParametroInvalidoError');
            expect(res.body.mensagem).toBe(mensagemErro);
        }
    )
});

describe('GET /receitas/:id', () => {
    it('retorna objeto que contém receita', async () => {
        const receitaMock = {
            descricao: 'mock',
            valor: 1,
            data: '2022-08-13'
        };
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(receitaMock));
        const id = '1';
        const res = await request(app)
            .get('/receitas/' + id);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            descricao: expect.any(String),
            valor: expect.any(Number),
            data: expect.any(String),
        });
    });
    it('deve retornar erro se a receita com id fornecido não for encontrada', async () => {
        const id = 1;
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(undefined));
        const res = await request(app)
            .get('/receitas/' + id);
        expect(res.statusCode).toBe(404);
        expect(res.body.erro).toBe('NaoEncontradoError');
        expect(res.body.mensagem).toBe(`O registro de id ${id} não foi encontrado!`);
    });
    test.each([undefined, 1.75 , 'erro'])('retorna mensagem de parâmetro inválido pela falta de valor válido para id na busca de receitas', async (id) => {
        const res = await request(app)
            .get('/receitas/' + id);
        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toBe('ParametroInvalidoError');
        expect(res.body.mensagem).toBe("É necessário fornecer um valor válido para 'id'!");
    });
    it('retorna mensagem de registro não encontrado para uma receita', async () => {
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(undefined));
        const id = '0';
        const res = await request(app)
            .get('/receitas/' + id);
        expect(res.statusCode).toBe(404);
        expect(res.body.erro).toBe('NaoEncontradoError');
        expect(res.body.mensagem).toBe(`O registro de id ${id} não foi encontrado!`);
    });
});

describe('POST /receitas', () => {
    it('cria novo registro de receita', async () => {
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve([]));
        const novaReceita = {
            descricao: 'mock',
            valor: 1,
            data: '2022-03-03'
        };
        const retornoEsperado = {
            id: 1,
            ...novaReceita,
            updatedAt: '2022-08-03T03:09:05.311Z',
            createdAt: '2022-08-03T03:09:05.311Z'
        };
        jest.spyOn(Model, 'create').mockImplementationOnce(() => Promise.resolve(retornoEsperado));
        const res = await request(app)
            .post('/receitas')
            .send(novaReceita);
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
            id: expect.any(Number),
            descricao: expect.any(String),
            valor: expect.any(Number),
            data: expect.any(String),
            updatedAt: expect.any(String),
            createdAt: expect.any(String)
        });
    });
    it('deve retornar erro se a receita já existe no mesmo mês', async () => {
        const novaReceita = {
            descricao: 'mock',
            valor: 1,
            data: '2022-03-03'
        };
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve([novaReceita]));
        const res = await request(app)
            .post('/receitas')
            .send(novaReceita);
        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toBe('ParametroInvalidoError');
        expect(res.body.mensagem).toBe('Esta receita já existe para este mês!');
    });
    test.each([[' ', 35.5, '2022-08-13', 'descricao'], ['mock', 'erro', '2022-08-13', 'valor'], ['mock', 35.5, 'erro', 'data']])(
        'deve retornar erro se os parâmetros da receita forem inválidos',
        async (descricao, valor, data, parametroObrigatorio) => {
            const res = await request(app)
                .post('/receitas')
                .send({ descricao, valor, data })
            expect(res.statusCode).toBe(400);
            expect(res.body.erro).toBe('ParametroInvalidoError');
            expect(res.body.mensagem).toBe(`É necessário fornecer um valor válido para '${parametroObrigatorio}'!`);
        }
    );
    it('deve retornar erro se faltar um parâmetro obrigatório para cadastro de nova receita', async () => {
        const novaReceita = { mock: 'mock' };
        const res = await request(app)
            .post('/receitas')
            .send(novaReceita);
        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toBe('ParametroInvalidoError');
        expect(res.body.mensagem).toBe(`O parâmetro 'descricao' é obrigatório!`);
    });
});

describe('PUT /receitas/:id', () => {
    it('deve atualizar registro de receita com novos dados fornecidos', async () => {
        const id = '1';
        const receitaRegistrada = {
            descricao: 'mock',
            valor: 1,
            data: '2022-03-03'
        };
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(receitaRegistrada));
        const dadosAtualizados = { descricao: 'mock2', data: '2022-07-07' };
        const receitaAtualizada = {
            descricao: 'mock',
            valor: 2,
            data: '2022-03-03'
        };
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve([]));
        jest.spyOn(Model, 'update').mockImplementationOnce(() => Promise.resolve());
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(receitaAtualizada));
        const res = await request(app)
            .put('/receitas/' + id)
            .send(dadosAtualizados);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            descricao: expect.any(String),
            valor: expect.any(Number),
            data: expect.any(String),
        });
    });
    test.each([{ data: '2022-03-21' }, { descricao: 'mock' }])(
        'deve retornar erro se a atualização provocar uma duplicidade de receitas',
        async (dadosAtualizados) => {
            const id = '1';
            const receitaRegistrada = {
                descricao: 'mock',
                valor: 1,
                data: '2022-03-03'
            };
            jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(receitaRegistrada));
            jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve([receitaRegistrada]));
            const res = await request(app)
                .put('/receitas/' + id)
                .send(dadosAtualizados);
            expect(res.statusCode).toBe(400);
            expect(res.body.erro).toBe('ParametroInvalidoError');
            expect(res.body.mensagem).toBe('Esta receita já existe para este mês!');
        }
    );
});

describe('DELETE /receitas/:id', () => {
    it('deve remover um registro de receita', async () => {
        const id = '1';
        const receitaRegistrada = {
            descricao: 'mock',
            valor: 1,
            data: '2022-03-03'
        };
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(receitaRegistrada));
        jest.spyOn(Model, 'destroy').mockImplementationOnce(() => Promise.resolve());
        const res = await request(app)
            .delete('/receitas/' + id);
        expect(res.statusCode).toBe(200);
        expect(res.body.mensagem).toBe(`Receita de id ${id} removida com sucesso!`);
    });
    it('deve retornar erro se a receita que se deseja remover não for encontrada', async () => {
        const id = 1;
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(undefined));
        const res = await request(app)
            .delete('/receitas/' + id);
        expect(res.statusCode).toBe(404);
        expect(res.body.erro).toBe('NaoEncontradoError');
        expect(res.body.mensagem).toBe(`O registro de id ${id} não foi encontrado!`);
    });
});

//*************************************** TESTES ROTAS DESPESAS ***************************************//
describe('GET /despesas', () => {
    it('retorna array com despesas', async () => {
        const despesasCadastradas = [
            { descricao: 'mock1', valor: 1, categoria: 'Outras', data: '2105-11-03' },
            { descricao: 'mock2', valor: 2, categoria: 'Outras', data: '2105-11-03' },
        ];
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve(despesasCadastradas));
        const res = await request(app)
            .get('/despesas');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        if (res.body.length > 0) {
            res.body.forEach(despesa => {
                expect(despesa).toMatchObject({
                    descricao: expect.any(String),
                    valor: expect.any(Number),
                    categoria: expect.any(String),
                    data: expect.any(String),
                });
            });
        }
    });
    it('deve retornar despesas cuja descrição contenham os parâmetros de busca', async () => {
        const despesa1 = { descricao: 'mock1', valor: 1, categoria: 'Outras', data: '2105-11-03' };
        const despesa2 = { descricao: 'mock2', valor: 2, categoria: 'Outras', data: '2105-11-03' };
        const despesasSimilares = [despesa1, despesa2];
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve(despesasSimilares));
        const res = await request(app)
            .get('/despesas?descricao=mock');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        if (res.body.length > 0) {
            res.body.forEach(despesa => {
                expect(despesa).toMatchObject({
                    descricao: expect.any(String),
                    valor: expect.any(Number),
                    categoria: expect.any(String),
                    data: expect.any(String),
                });
                expect(despesa.descricao).toMatch(/mock/g);
            });
        }
    });
    it('retorna erro interno se ocorrer erro inesperado na busca de despesas', async () => {
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.reject(new Error()));
        const res = await request(app)
            .get('/despesas');
        expect(res.statusCode).toBe(500);
        expect(res.body.mensagem).toBe('Erro interno do servidor');
    });
});

describe('GET /despesas/:ano/:mes', () => {
    it('retorna array com despesas de um mês', async () => {
        const despesasNoMes = [
            { descricao: 'mock1', valor: 1, categoria: 'Outras', data: '2105-08-03' },
            { descricao: 'mock2', valor: 2, categoria: 'Outras', data: '2105-08-03' },
        ];
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve(despesasNoMes));
        const ano = '2015';
        const mes = '8'
        const res = await request(app)
            .get(`/despesas/${ano}/${mes}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
        if (res.body.length > 0) {
            res.body.forEach(despesa => {
                expect(despesa).toMatchObject({
                    descricao: expect.any(String),
                    valor: expect.any(Number),
                    categoria: expect.any(String),
                    data: expect.any(String),
                });
            });
        }
    });
    test.each([
        [null, '08', 'ano'],
        ['erro', '08', 'ano'],
        ['92', '08', 'ano'],
        ['2022', null, 'mes'],
        ['2022', 'erro', 'mes'],
        ['2022', '0', 'mes'],
        ['2022', '13', 'mes']
    ]) (
        'deve retornar mensagem de parâmetro inválido para ano ou mês inválidos na busca de despesas',
        async (ano, mes, parametroObrigatorio) => {
            const mensagemErro = `É necessário fornecer um valor válido para '${parametroObrigatorio}'!`
            const res = await request(app)
                .get(`/despesas/${ano}/${mes}`);
            expect(res.statusCode).toBe(400);
            expect(res.body.erro).toBe('ParametroInvalidoError');
            expect(res.body.mensagem).toBe(mensagemErro);
        }
    )
});

describe('GET /despesas/:id', () => {
    it('retorna objeto que contém despesa', async () => {
        const despesaMock = {
            descricao: 'mock',
            valor: 1,
            categoria: 'Outras',
            data: '2022-08-13'
        };
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(despesaMock));
        const id = '1';
        const res = await request(app)
            .get('/despesas/' + id);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            descricao: expect.any(String),
            valor: expect.any(Number),
            categoria: expect.any(String),
            data: expect.any(String),
        });
    });
    it('deve retornar erro se a despesa com id fornecido não for encontrada', async () => {
        const id = 1;
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(undefined));
        const res = await request(app)
            .get('/despesas/' + id);
        expect(res.statusCode).toBe(404);
        expect(res.body.erro).toBe('NaoEncontradoError');
        expect(res.body.mensagem).toBe(`O registro de id ${id} não foi encontrado!`);
    });
    test.each([undefined, 1.75 , 'erro'])('retorna mensagem de parâmetro inválido pela ausência de valor válido para id da despesa', async (id) => {
        const res = await request(app)
            .get('/receitas/' + id);
        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toBe('ParametroInvalidoError');
        expect(res.body.mensagem).toBe("É necessário fornecer um valor válido para 'id'!");
    });
    it('retorna mensagem de registro de despesa não encontrado', async () => {
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(undefined));
        const id = '0';
        const res = await request(app)
            .get('/despesas/' + id);
        expect(res.statusCode).toBe(404);
        expect(res.body.erro).toBe('NaoEncontradoError');
        expect(res.body.mensagem).toBe(`O registro de id ${id} não foi encontrado!`);
    });
});

describe('POST /despesas', () => {
    it('cria novo registro de despesa', async () => {
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve([]));
        const novaDespesa = {
            descricao: 'mock',
            valor: 1,
            categoria: 'Outras',
            data: '2022-03-03'
        };
        const retornoEsperado = {
            id: 1,
            ...novaDespesa,
            updatedAt: '2022-08-03T03:09:05.311Z',
            createdAt: '2022-08-03T03:09:05.311Z'
        };
        jest.spyOn(Model, 'create').mockImplementationOnce(() => Promise.resolve(retornoEsperado));
        const res = await request(app)
            .post('/despesas')
            .send(novaDespesa);
        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
            id: expect.any(Number),
            descricao: expect.any(String),
            valor: expect.any(Number),
            categoria: expect.any(String),
            data: expect.any(String),
            updatedAt: expect.any(String),
            createdAt: expect.any(String)
        });
    });
    it('deve retornar erro se a despesa já existe no mesmo mês', async () => {
        const novaDespesa = {
            descricao: 'mock',
            valor: 1,
            categoria: 'Outras',
            data: '2022-03-03'
        };
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve([novaDespesa]));
        const res = await request(app)
            .post('/despesas')
            .send(novaDespesa);
        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toBe('ParametroInvalidoError');
        expect(res.body.mensagem).toBe('Esta despesa já existe para este mês!');
    });
    test.each([
        [null, 35.5, 'Outras', '2022-08-13', 'descricao'],
        ['mock', 'erro', 'Outras', '2022-08-13', 'valor'],
        ['mock', 35.5, 'erro', '2022-08-08', 'categoria'],
        ['mock', 35.5, 'Outras', 'erro', 'data']
    ])(
        'deve retornar erro se os parâmetros da despesa forem inválidos',
        async (descricao, valor, categoria, data, parametroObrigatorio) => {
            const res = await request(app)
                .post('/despesas')
                .send({ descricao: descricao, valor: valor, categoria: categoria, data: data })
            expect(res.statusCode).toBe(400);
            expect(res.body.erro).toBe('ParametroInvalidoError');
            expect(res.body.mensagem).toBe(`É necessário fornecer um valor válido para '${parametroObrigatorio}'!`);
        }
    );
    it('deve retornar erro se faltar um parâmetro obrigatório no cadastro de nova despesa', async () => {
        const novaDespesa = { mock: 'mock' };
        const res = await request(app)
            .post('/despesas')
            .send(novaDespesa);
        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toBe('ParametroInvalidoError');
        expect(res.body.mensagem).toBe(`O parâmetro 'descricao' é obrigatório!`);
    });
});

describe('PUT /despesas/:id', () => {
    it('deve atualizar registro de despesa com novos dados fornecidos', async () => {
        const id = '1';
        const despesaRegistrada = {
            descricao: 'mock',
            valor: 1,
            categoria: 'Outras',
            data: '2022-03-03'
        };
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(despesaRegistrada));
        const dadosAtualizados = { descricao: 'mock2', data: '2022-07-07' };
        const despesaAtualizada = {
            descricao: 'mock',
            valor: 2,
            categoria: 'Outras',
            data: '2022-03-03'
        };
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve([]));
        jest.spyOn(Model, 'update').mockImplementationOnce(() => Promise.resolve());
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(despesaAtualizada));
        const res = await request(app)
            .put('/despesas/' + id)
            .send(dadosAtualizados);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            descricao: expect.any(String),
            valor: expect.any(Number),
            data: expect.any(String),
        });
    });
    test.each([{ data: '2022-03-21' }, { descricao: 'mock' }])(
        'deve retornar erro se a atualização provocar uma duplicidade de despesas',
        async (dadosAtualizados) => {
            const id = '1';
            const despesaRegistrada = {
                descricao: 'mock',
                valor: 1,
                categoria: 'Outras',
                data: '2022-03-03'
            };
            jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(despesaRegistrada));
            jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve([despesaRegistrada]));
            const res = await request(app)
                .put('/despesas/' + id)
                .send(dadosAtualizados);
            expect(res.statusCode).toBe(400);
            expect(res.body.erro).toBe('ParametroInvalidoError');
            expect(res.body.mensagem).toBe('Esta despesa já existe para este mês!');
        }
    );
});

describe('DELETE /despesas/:id', () => {
    it('deve remover um registro de despesa', async () => {
        const id = '1';
        const despesaRegistrada = {
            descricao: 'mock',
            valor: 1,
            categoria: 'Outras',
            data: '2022-03-03'
        };
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(despesaRegistrada));
        jest.spyOn(Model, 'destroy').mockImplementationOnce(() => Promise.resolve());
        const res = await request(app)
            .delete('/despesas/' + id);
        expect(res.statusCode).toBe(200);
        expect(res.body.mensagem).toBe(`Despesa de id ${id} removida com sucesso!`);
    });
    it('deve retornar erro se a despesa que se deseja remover não for encontrada', async () => {
        const id = 1;
        jest.spyOn(Model, 'findOne').mockImplementationOnce(() => Promise.resolve(undefined));
        const res = await request(app)
            .delete('/despesas/' + id);
        expect(res.statusCode).toBe(404);
        expect(res.body.erro).toBe('NaoEncontradoError');
        expect(res.body.mensagem).toBe(`O registro de id ${id} não foi encontrado!`);
    });
});

//*************************************** TESTES ROTAS RESUMO ***************************************//
describe('GET /resumo/:ano/:mes', () => {
    it('deve retornar resumo de receitas, despesas totais e por categoria e saldo do mês', async () => {
        const despesasNoMes = [
            { valor: 1, categoria: 'Outras' },
            { valor: 2, categoria: 'Outras' }
        ];
        const ano = '2015';
        const mes = '08'
        jest.spyOn(Model, 'sum').mockImplementationOnce(() => Promise.resolve());
        jest.spyOn(Model, 'sum').mockImplementationOnce(() => Promise.resolve(3));
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve(despesasNoMes));
        const res = await request(app)
            .get('/resumo/' + ano + '/' + mes);
        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            receita: expect.any(String),
            despesa: expect.any(String),
            saldo: expect.any(String),
            categorias: expect.objectContaining({
                'Alimentação': expect.any(String),
                'Saúde': expect.any(String),
                'Moradia': expect.any(String),
                'Transporte': expect.any(String),
                'Educação': expect.any(String),
                'Lazer': expect.any(String),
                'Imprevistos': expect.any(String),
                'Outras': expect.any(String),
            })
        });
    });
    test.each([['92', '02', 'ano'], ['1992', '20', 'mes']])(
        'deve retornar erro se um dos parâmetros ano ou mês for inválido para a busca do resumo',
        async (ano, mes, parametroObrigatorio) => {
            const res = await request(app)
                .get('/resumo/' + ano + '/' + mes);
            expect(res.statusCode).toBe(400);
            expect(res.body.erro).toBe('ParametroInvalidoError');
            expect(res.body.mensagem).toBe(`É necessário fornecer um valor válido para '${parametroObrigatorio}'!`);
        }
    );
});