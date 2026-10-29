# CRUD de Produtos — Angular + API Express

Projeto acadêmico de integração de uma aplicação Angular com uma API Node.js/Express. A interface permite listar, consultar, cadastrar, atualizar e excluir produtos por requisições HTTP.

## Implementação presente neste repositório

O [ProdutoService](frontend/src/app/produtos/produto.service.ts) utiliza `HttpClient` para as cinco operações do CRUD. O projeto também inclui uma [coleção do Postman](CRUD_Ecommerce_Postman.postman_collection.json) e um [script Selenium](frontend/testes-selenium/cadastro-produto.test.js) para o fluxo de cadastro.

A atividade parte de um projeto-base com telas e backend fornecidos. O [enunciado original](docs/atividade-original.md) foi preservado para deixar claro o contexto da entrega.

## Tecnologias

- Angular, TypeScript, RxJS e Bootstrap
- Node.js e Express
- Persistência em arquivo JSON no backend
- Postman e Selenium WebDriver

## Executar

Clone o projeto e mantenha backend e frontend em terminais separados:

```bash
git clone https://github.com/hugosilvans/angular-crud-api.git
cd angular-crud-api
```

**Terminal 1 — API:**

```bash
cd backend
npm ci
npm start
```

API: [http://localhost:3000/api/products](http://localhost:3000/api/products).

**Terminal 2 — interface**, a partir da raiz do repositório:

```bash
cd frontend
npm ci
npm start
```

Interface: [http://localhost:4200](http://localhost:4200).

É necessário ter Node.js e npm compatíveis com as versões do Angular declaradas em [frontend/package.json](frontend/package.json). O script local inicia o Angular CLI; não é necessário instalá-lo globalmente.

## Endpoints

| Método | Caminho | Operação |
| --- | --- | --- |
| GET | `/api/products` | Listar |
| GET | `/api/products/:id` | Buscar por ID |
| POST | `/api/products` | Cadastrar |
| PUT | `/api/products/:id` | Atualizar |
| DELETE | `/api/products/:id` | Excluir |

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| [frontend/src/app/produtos](frontend/src/app/produtos/) | Serviço, modelo, listagem e formulário |
| [backend/src/server.js](backend/src/server.js) | API |
| [backend/data/produtos.json](backend/data/produtos.json) | Dados persistidos |
| [frontend/testes-selenium](frontend/testes-selenium/) | Automação de navegador |
| [docs/atividade-original.md](docs/atividade-original.md) | Instruções originais da atividade |

## Verificação local

Com as duas aplicações abertas, confira a listagem, cadastre um produto fictício, edite-o e exclua-o. A coleção do Postman permite exercitar a API separadamente.

Para verificar o build do frontend:

```bash
cd frontend
npm run build
```

Os arquivos de teste estão incluídos como parte do projeto; sua presença não representa uma execução bem-sucedida dos testes.

## Origem e atribuição

Este repositório foi iniciado como fork de [HevelinFR/angular-crud-api](https://github.com/HevelinFR/angular-crud-api). A base e o histórico incluem contribuições dos autores do projeto de origem. As alterações e a organização mantidas nesta conta podem ser consultadas no histórico de commits. Os créditos e os avisos de licença existentes devem ser preservados.
