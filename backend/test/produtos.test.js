const { test } = require('node:test');
const assert = require('node:assert/strict');
const { criarApp } = require('../src/app');

const valido = { nome: 'Livro', descricao: 'Estudo', categoria: 'Livros', preco: 10 };

test('CRUD completo e rejeição de preço inválido', async (t) => {
  let produtos = [];
  const app = criarApp({
    listar: () => structuredClone(produtos),
    salvar: (itens) => {
      produtos = itens;
    },
  });
  const servidor = app.listen(0);
  t.after(() => servidor.close());
  const base = `http://127.0.0.1:${servidor.address().port}/api/products`;
  const enviar = (url, method, body) =>
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  assert.equal((await enviar(base, 'POST', { ...valido, preco: 'abc' })).status, 400);
  const cadastro = await enviar(base, 'POST', valido);
  assert.equal(cadastro.status, 201);
  const produto = await cadastro.json();
  assert.equal((await (await fetch(`${base}/${produto.id}`)).json()).nome, 'Livro');
  assert.equal(
    (await enviar(`${base}/${produto.id}`, 'PUT', { ...valido, preco: 20 })).status,
    200,
  );
  assert.equal((await fetch(`${base}/${produto.id}`, { method: 'DELETE' })).status, 204);
  assert.equal((await fetch(`${base}/${produto.id}`)).status, 404);
  assert.equal((await fetch(`${base}/1abc`)).status, 400);
});

test('erro de persistência produz 500 em vez de falso sucesso', async (t) => {
  const app = criarApp({
    listar: () => [],
    salvar: () => {
      throw new Error('disco indisponível');
    },
  });
  const servidor = app.listen(0);
  t.after(() => servidor.close());
  const resposta = await fetch(`http://127.0.0.1:${servidor.address().port}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(valido),
  });
  assert.equal(resposta.status, 500);
});
