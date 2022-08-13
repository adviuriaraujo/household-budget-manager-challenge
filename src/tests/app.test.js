const request = require('supertest');
const app = require('../app');
const { Model } = require('sequelize');

jest.mock('../../node_modules/sequelize/lib/model.js');

describe('GET /receitas', () => {
    it('retorna array com receitas', async () => {
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve([{ mock: 'ok'}]));
        const res = await request(app)
            .get('/receitas');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    });
    it('retorna erro interno se ocorrer erro inesperado na busca', async () => {
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.reject(new Error()));
        const res = await request(app)
            .get('/receitas');
        expect(res.statusCode).toBe(500);
        expect(res.body.mensagem).toBe('Erro interno do servidor');
    });
});

describe('GET /receitas/:ano/:mes', () => {
    it('retorna array com receitas de um mês', async () => {
        jest.spyOn(Model, 'findAll').mockImplementationOnce(() => Promise.resolve([{ mock: 'ok'}]));
        const ano = '2015';
        const mes = '11'
        const res = await request(app)
            .get(`/receitas/${ano}/${mes}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
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
        'deve retornar mensagem de parâmetro inválido para ano ou mês inválidos',
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
    test.each([undefined, 1.75 , 'erro'])('retorna mensagem de parâmetro inválido', async (arg) => {
        const id = arg;
        const res = await request(app)
            .get('/receitas/' + id);
        expect(res.statusCode).toBe(400);
        expect(res.body.erro).toBe('ParametroInvalidoError');
        expect(res.body.mensagem).toBe("É necessário fornecer um valor válido para 'id'!");
    });
    it('retorna mensagem de registro não encontrado', async () => {
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
    it('deve retornar erro se faltar um parâmetro obrigatório', async () => {
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
});

