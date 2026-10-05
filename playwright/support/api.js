// support/api.js
// Cliente da API do ServeRest usado para PREPARAR e LIMPAR os dados dos
// testes. Montar o cenário pela API (e não pela tela) deixa cada teste
// rápido e focado só no comportamento que ele valida.

class ApiServeRest {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {string} baseURL ex.: http://localhost:3000
   */
  constructor(request, baseURL) {
    this.request = request;
    this.baseURL = baseURL;
  }

  async #chamar(metodo, caminho, { token, data } = {}) {
    const resposta = await this.request.fetch(`${this.baseURL}${caminho}`, {
      method: metodo,
      data,
      headers: token ? { Authorization: token } : {},
    });
    if (resposta.status() === 429) {
      throw new Error(
        "O ServeRest respondeu 429 (limite de requisições). No servidor público o limite é somado entre todos " +
          "os usuários; rode a API local: docker compose up -d (na raiz do serverest-qa) e SERVEREST_API_URL=http://localhost:3000.",
      );
    }
    return { status: resposta.status(), corpo: await resposta.json().catch(() => ({})) };
  }

  /** Faz login e devolve o token ("Bearer ..."). */
  async login(email, senha) {
    const { status, corpo } = await this.#chamar("POST", "/login", { data: { email, password: senha } });
    if (status !== 200) throw new Error(`Login na API falhou (${status}): ${corpo.message}`);
    return corpo.authorization;
  }

  /** Cria o usuário; 400 ("email já usado") também é aceito. Devolve o _id. */
  async garantirUsuario({ nome, email, senha, administrador }) {
    const { status } = await this.#chamar("POST", "/usuarios", {
      data: { nome, email, password: senha, administrador: String(administrador) },
    });
    if (![201, 400].includes(status)) throw new Error(`Não foi possível criar o usuário ${email} (${status})`);
    return (await this.buscarUsuarioPorEmail(email))?._id;
  }

  async buscarUsuarioPorEmail(email) {
    const { corpo } = await this.#chamar("GET", `/usuarios?email=${encodeURIComponent(email)}`);
    return corpo.usuarios?.[0];
  }

  async excluirUsuario(id) {
    if (id) await this.#chamar("DELETE", `/usuarios/${id}`);
  }

  /** Cadastra o produto (exige token de administrador) e devolve o _id. */
  async criarProduto(token, { nome, preco, descricao, quantidade }) {
    const { status, corpo } = await this.#chamar("POST", "/produtos", {
      token,
      data: { nome, preco, descricao, quantidade },
    });
    if (status !== 201) throw new Error(`Não foi possível criar o produto ${nome} (${status}): ${JSON.stringify(corpo)}`);
    return corpo._id;
  }

  async buscarProdutoPorNome(nome) {
    const { corpo } = await this.#chamar("GET", `/produtos?nome=${encodeURIComponent(nome)}`);
    return corpo.produtos?.[0];
  }

  async excluirProduto(token, id) {
    if (id) await this.#chamar("DELETE", `/produtos/${id}`, { token });
  }
}

module.exports = { ApiServeRest };
