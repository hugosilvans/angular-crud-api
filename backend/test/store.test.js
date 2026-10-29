const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { criarRepositorio } = require('../src/data/produtos-store');

test('arquivo persiste dados e falha explicitamente com JSON corrompido', (t) => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'produtos-'));
  t.after(() => fs.rmSync(pasta, { recursive: true, force: true }));
  const arquivo = path.join(pasta, 'produtos.json');
  const repositorio = criarRepositorio(arquivo);
  assert.deepEqual(repositorio.listar(), []);
  repositorio.salvar([{ id: 1, nome: 'Teste' }]);
  assert.deepEqual(repositorio.listar(), [{ id: 1, nome: 'Teste' }]);
  assert.equal(
    fs.readdirSync(pasta).some((nome) => nome.endsWith('.tmp')),
    false,
  );
  fs.writeFileSync(arquivo, '{invalido');
  assert.throws(() => repositorio.listar());
});
