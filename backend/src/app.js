const express = require('express');
const cors = require('cors');
const path = require('node:path');
const { criarRepositorio } = require('./data/produtos-store');

function validarProduto(corpo) {
  if (
    !corpo ||
    !['nome', 'descricao', 'categoria'].every(
      (campo) => typeof corpo[campo] === 'string' && corpo[campo].trim(),
    )
  )
    return null;
  // Não aceitar "abc", Infinity ou strings vazias como preço.
  const preco =
    typeof corpo.preco === 'number' || (typeof corpo.preco === 'string' && corpo.preco.trim())
      ? Number(corpo.preco)
      : NaN;
  if (!Number.isFinite(preco) || preco <= 0) return null;
  if (corpo.imagem != null && typeof corpo.imagem !== 'string') return null;
  return {
    nome: corpo.nome.trim(),
    descricao: corpo.descricao.trim(),
    categoria: corpo.categoria.trim(),
    preco,
    imagem: corpo.imagem || '',
  };
}

function criarApp(repositorio = criarRepositorio(path.join(__dirname, '../data/produtos.json'))) {
  const app = express();
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:4200' }));
  app.use(express.json({ limit: '100kb' }));
  app.param('id', (req, res, next, valor) => {
    if (!/^\d+$/.test(valor) || !Number.isSafeInteger(Number(valor)) || Number(valor) <= 0) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }
    req.produtoId = Number(valor);
    next();
  });

  app.get('/api/products', (req, res) => res.json(repositorio.listar()));
  app.get('/api/products/:id', (req, res) => {
    const produto = repositorio.listar().find((p) => p.id === req.produtoId);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(produto);
  });
  app.post('/api/products', (req, res) => {
    const dados = validarProduto(req.body);
    if (!dados) return res.status(400).json({ erro: 'Dados do produto inválidos.' });
    const produtos = repositorio.listar();
    const produto = { id: produtos.reduce((max, p) => Math.max(max, p.id), 0) + 1, ...dados };
    produtos.push(produto);
    repositorio.salvar(produtos);
    // Só confirmar o cadastro depois que a persistência terminou sem erro.
    res.status(201).json(produto);
  });
  app.put('/api/products/:id', (req, res) => {
    const dados = validarProduto(req.body);
    if (!dados) return res.status(400).json({ erro: 'Dados do produto inválidos.' });
    const produtos = repositorio.listar();
    const indice = produtos.findIndex((p) => p.id === req.produtoId);
    if (indice < 0) return res.status(404).json({ erro: 'Produto não encontrado.' });
    produtos[indice] = { id: req.produtoId, ...dados };
    repositorio.salvar(produtos);
    res.json(produtos[indice]);
  });
  app.delete('/api/products/:id', (req, res) => {
    const produtos = repositorio.listar();
    const indice = produtos.findIndex((p) => p.id === req.produtoId);
    if (indice < 0) return res.status(404).json({ erro: 'Produto não encontrado.' });
    produtos.splice(indice, 1);
    repositorio.salvar(produtos);
    res.status(204).end();
  });

  // Falhas de disco não podem ser convertidas em respostas de sucesso.
  app.use((erro, req, res, next) => {
    if (erro.type === 'entity.parse.failed')
      return res.status(400).json({ erro: 'JSON inválido.' });
    if (erro.type === 'entity.too.large')
      return res.status(413).json({ erro: 'Corpo muito grande.' });
    console.error('Falha na API de produtos:', erro.message);
    res.status(500).json({ erro: 'Não foi possível concluir a operação.' });
  });
  return app;
}

module.exports = { criarApp, validarProduto };
