# household-budget-manager-challenge 📒
## ⚠️ Work in progress | Em desenvolvimento ⚠️

- [EN-US](#en-us)
- [PT-BR](#pt-br)

### EN-US
## Index
- [Description](#description)
- [Getting Started](#getting-started)
- [Routes](#routes)


## Description

**This project is my solution to [Alura's 4th back-end challenge](https://www.alura.com.br/challenges/back-end-4?host=https://cursos.alura.com.br).**
The challenge's based on developing the back-end for a houlsehold budget management application.
Its core requirements are:
- implementing any form of data persistence in a database; 
- having REST API's endpoints for managing monthly incomes and expenses;

This app was built on NodeJS, using Express, Sequelize and MySQL.

## Getting started
### Installation
```bash
$ npm install
```
### Setting up
Create a `.env` file on the project's root and fill in the following info:
```bash
PORT=TYPE-IN-THE-PORT-YOU-WANT-HERE

# sequelize
SQLUSERNAME=TYPE-IN-YOUR-MYSQL-USERNAME-HERE
PASSWORD=TYPE-IN-YOUR-PASSWORD-HERE
DATABASE=TYPE-IN-YOUR-DATABASE-NAME-HERE
HOST=TYPE-IN-YOUR-HOST-HERE
```
That info will be used to establish the API's connection to your database through enviroment variables.

### Running the app
```bash
$ npm start
```
or
```bash
$ npm run dev
```
## Routes

### Income Request Examples

<details>
  <summary>Get all income records</summary>
  
  ```bash
  GET /receitas
  ```
  optional search by description:
  ```bash
  GET /receitas?descricao=DESCRIPTION
  ```
  
</details>
<details>
  <summary>Get all income records on a specific month</summary>
  
  ```bash
  GET /receitas/:ano/:mes
  ```
  
</details>
<details>
  <summary>Get a single income record</summary>
  
  ```bash
  GET /receitas/:id
  ```
  
</details>
<details>
  <summary>Create a new income record</summary>
  
  ```bash
  POST /receitas
  ```
  Body example:
  ```json
  {
    "descricao": "salário",
    "valor": 1500.97,
    "data": "2022-05-01"
  }
  ```
  
</details>
<details>
  <summary>Update a single income record</summary>
  
  ```bash
  PUT /receitas/:id
  ```
  Body example:
  ```json
  {
    "data": "2022-02-01"
  }
  ```
  
</details>
<details>
  <summary>Remove a single income record</summary>
  
  ```bash
  DELETE /receitas/:id
  ```
  
</details>

### Expenses Request Examples

<details>
  <summary>Get all expenses records</summary>
  
  ```bash
  GET /despesas
  ```
  optional search by description:
  ```bash
  GET /despesas?descricao=DESCRIPTION
  ```
  
</details>
<details>
  <summary>Get all expenses records on a specific month</summary>
  
  ```bash
  GET /despesas/:ano/:mes
  ```
  
</details>
<details>
  <summary>Get a single expense record</summary>
  
  ```bash
  GET /despesas/:id
  ````
  
</details>
<details>
  <summary>Create a new expense record</summary>
  
  ```bash
  POST /despesas
  ```
  Body example:
  ```json
  {
    "descricao": "conta de luz",
    "valor": 300.97,
    "categoria": "Moradia",
    "data": "2022-05-08"
  }
  ```
  
</details>
<details>
  <summary>Update a single expense record</summary>
  
  ```bash
  PUT /despesas/:id
  ```
  Body example:
  ```json
  {
    "descricao": "conta de luz",
    "valor": 300.97
  }
  ```
  
</details>
<details>
  <summary>Remove a single expense record</summary>
  
  ```bash
  DELETE /despesas/:id
  ```
  
</details>

### Summary Request Examples
<details>
  <summary>Get a summary of all income, total expenses, balance and expenses by category on a specific month</summary>
  
  ```bash
  GET /resumo/:ano/:mes
  ```
  
</details>

### PT-BR
## Índice
- [Descrição](#descrição)
- [Primeiros Passos](#primeiros-passos)
- [Rotas](#rotas)

## Descrição
**Este projeto é a minha solução para o [quarto desafio de back-end da Alura](https://www.alura.com.br/challenges/back-end-4?host=https://cursos.alura.com.br).**
O desafio se baseia no desenvolvimento de uma aplicação para gerenciar orçamento doméstico.
Seus principais requisitos são:
- implementar alguma forma de persistência de dados em uma base de dados;
- ter endpoints de API REST para gerenciar receitas e despesas mensais;

Esta aplicação foi construída com NodeJs, Express, Sequelize e MySql.

## Primeiros Passos
### Instalação
```bash
$ npm install
```
### Preparando
Create a `.env` file on the project's root and fill in the following info:
Crie um arquivo `.env` na raiz do projeto e preencha as seguintes informações:
```bash
PORT=DIGITE-A-PORTA-QUE-QUISER-AQUI

# sequelize
SQLUSERNAME=DIGITE-SEU-USERNAME-DO-MYSQL-AQUI
PASSWORD=DIGITE-SUA-SENHA-AQUI
DATABASE=DIGITE-O-NOME-DO-BANCO-DE-DADOS-AQUI
HOST=DIGITE-O-HOST-AQUI
```
Essas informações serão usadas para estabelecer a conexão da API com seu banco de dados através de variáveis de ambiente.

### Rodando a aplicação
```bash
$ npm start
```
or
```bash
$ npm run dev
```
## Rotas

### Exemplos de Requisição de Receitas

<details>
  <summary>Pega todos registros de receitas</summary>
  
  ```bash
  GET /receitas
  ```
  Pesquisa opcional por descrição:
  ```bash
  GET /receitas?descricao=DESCRIÇÃO
  ```
  
</details>
<details>
  <summary>Pega todos registros de receitas em um mês específico</summary>
  
  ```bash
  GET /receitas/:ano/:mes
  ```
  
</details>
<details>
  <summary>Pega um registro de receita</summary>
  
  ```bash
  GET /receitas/:id
  ```
  
</details>
<details>
  <summary>Cria um novo registro de receita</summary>
  
  ```bash
  POST /receitas
  ```
  Exemplo de Body:
  ```json
  {
    "descricao": "salário",
    "valor": 1500.97,
    "data": "2022-05-01"
  }
  ```
  
</details>
<details>
  <summary>Atualiza um registro de receita</summary>
  
  ```bash
  PUT /receitas/:id
  ```
  Exemplo de Body:
  ```json
  {
    "data": "2022-02-01"
  }
  ```
  
</details>
<details>
  <summary>Remove um registro de receita</summary>
  
  ```bash
  DELETE /receitas/:id
  ```
  
</details>

### Exemplos de Requisição de Despesas

<details>
  <summary>Pega todos os registros de despesas</summary>
  
  ```bash
  GET /despesas
  ```
  Pesquisa opcional por descrição:
  ```bash
  GET /despesas?descricao=DESCRIÇÃO
  ```
  
</details>
<details>
  <summary>Pega todos os registros de despesas em um mês específico</summary>
  
  ```bash
  GET /despesas/:ano/:mes
  ```
  
</details>
<details>
  <summary>Pega um registro de despesa</summary>
  
  ```bash
  GET /despesas/:id
  ````
  
</details>
<details>
  <summary>Cria um novo registro de despesa</summary>
  
  ```bash
  POST /despesas
  ```
  Exemplo de Body:
  ```json
  {
    "descricao": "conta de luz",
    "valor": 300.97,
    "categoria": "Moradia",
    "data": "2022-05-08"
  }
  ```
  
</details>
<details>
  <summary>Atualiza um registro de despesa</summary>
  
  ```bash
  PUT /despesas/:id
  ```
  Exemplo de Body:
  ```json
  {
    "descricao": "conta de luz",
    "valor": 300.97
  }
  ```
  
</details>
<details>
  <summary>Remove um registro de despesa</summary>
  
  ```bash
  DELETE /despesas/:id
  ```
  
</details>

### Examplos de Requisição de Resumo
<details>
  <summary>Pega resumo de todas receitas, despesas, saldo e despesas por categoria em um mês específico</summary>
  
  ```bash
  GET /resumo/:ano/:mes
  ```
  
</details>
