// support/dados.js
// Geradores de massa de teste. Nome e e-mail ÚNICOS em cada chamada evitam
// colisão entre testes paralelos e com dados que sobraram de execuções antigas.

const sufixo = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

function novoUsuario({ administrador = false } = {}) {
  const id = sufixo();
  return { nome: `QA Usuario ${id}`, email: `qa.${id}@teste.com`, senha: "teste123", administrador };
}

function novoProduto() {
  return {
    nome: `Produto QA ${sufixo()}`,
    preco: 150,
    descricao: "Produto criado pelo teste automatizado",
    quantidade: 10,
  };
}

module.exports = { novoUsuario, novoProduto };
