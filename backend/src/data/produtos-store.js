const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

// Um arquivo JSON é suficiente para esta atividade de processo único.
// Escrita temporária + rename evita deixar JSON parcial se a gravação falhar.
function criarRepositorio(arquivo) {
  return {
    listar() {
      if (!fs.existsSync(arquivo)) return [];
      const produtos = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
      if (!Array.isArray(produtos)) throw new Error('Arquivo de produtos inválido.');
      return produtos;
    },
    salvar(produtos) {
      const temporario = `${arquivo}.${randomUUID()}.tmp`;
      try {
        fs.writeFileSync(temporario, JSON.stringify(produtos, null, 2), 'utf8');
        fs.renameSync(temporario, arquivo);
      } finally {
        if (fs.existsSync(temporario)) fs.unlinkSync(temporario);
      }
    },
  };
}

module.exports = { criarRepositorio };
