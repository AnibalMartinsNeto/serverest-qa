# Regras de negócio – ServeRest

Fonte da verdade sobre o **comportamento esperado** do sistema testado. O painel de QA (painel-pro) envia este arquivo à IA na triagem das falhas: com ele, a IA decide se o problema é do **sistema** (viola uma regra) ou do **teste** (espera algo que as regras não dizem).

Como manter:
- Uma regra por linha, objetiva e verificável. Quando houver, coloque a mensagem exata entre aspas.
- Use o código da regra (ex.: `USU-01`) nos testes e nos bugs, para rastrear.
- Regra mudou? Atualize aqui no mesmo commit que muda o teste.

Origem: documentação oficial da API (https://serverest.dev) e comportamento conferido na API local. Regras marcadas com **[QA]** são requisitos definidos pelo time de QA, mesmo que a aplicação ainda não os cumpra.

---

## Login e autenticação

- **LOG-01** – Login válido (`POST /login`) retorna 200, a mensagem "Login realizado com sucesso" e um token em `authorization`, no formato `Bearer ...`.
- **LOG-02** – E-mail ou senha errados retornam 401 com "Email e/ou senha inválidos". A mensagem não diz qual dos dois está errado.
- **LOG-03** – O token vale 600 segundos (10 minutos). Token ausente, inválido ou expirado retorna 401 com "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais".
- **LOG-04** – No front, o administrador é levado para `/admin/home` (título "Bem Vindo", botão de logout) e o usuário comum para `/home` (loja "Serverest Store").
- **LOG-05** – No front, login inválido mantém o usuário em `/login` e mostra o alerta "Email e/ou senha inválidos".

## Usuários

- **USU-01** – Nome, e-mail e senha são obrigatórios. Na API: "nome não pode ficar em branco", "password não pode ficar em branco". No front: "Nome é obrigatório", "Email é obrigatório", "Password é obrigatório".
- **USU-02** – O e-mail precisa ser válido ("email deve ser um email válido").
- **USU-03** – O e-mail é único. Cadastrar ou editar com e-mail já usado retorna 400 com "Este email já está sendo usado".
- **USU-04** – O campo `administrador` só aceita "true" ou "false" ("administrador deve ser 'true' ou 'false'").
- **USU-05** – O cadastro público (`/cadastrarusuarios`) cria usuário comum (`administrador: "false"`), a menos que o checkbox de administrador seja marcado, e leva o usuário para a loja (`/home`).
- **USU-06** – Não é permitido excluir usuário que tem carrinho (400, "Não é permitido excluir usuário com carrinho cadastrado").
- **USU-07** – Editar (`PUT /usuarios/{id}`) com um id que não existe **cria** um usuário novo (201) em vez de dar erro.
- **USU-08** – Só o administrador acessa as telas `/admin/*` (cadastro e lista de usuários e produtos).
- **USU-09 [QA]** – **A senha nunca pode ser exibida** em telas, listagens ou relatórios, nem em texto puro nem mascarada. Requisito de segurança: hoje a lista de usuários do admin mostra a senha. É um **defeito conhecido da aplicação**, e o teste que valida esta regra falha de propósito.

## Produtos

- **PRO-01** – Só administradores cadastram, editam ou excluem produtos. Usuário comum recebe 403 com "Rota exclusiva para administradores".
- **PRO-02** – Nome, preço, descrição e quantidade são obrigatórios. No front: "Nome é obrigatório", "Preco é obrigatório", "Descricao é obrigatório", "Quantidade é obrigatório".
- **PRO-03** – O nome do produto é único ("Já existe produto com esse nome").
- **PRO-04** – O preço é um número **inteiro e positivo**, sem centavos. O front bloqueia valores como 10.50 pela validação do próprio campo, sem chamar a API.
- **PRO-05** – A quantidade é um número inteiro, maior ou igual a zero.
- **PRO-06** – Não é permitido excluir produto que faz parte de um carrinho (400, "Não é permitido excluir produto que faz parte de carrinho").
- **PRO-07** – Após cadastrar pelo front, o administrador é levado para a lista de produtos (`/admin/listarprodutos`), onde o produto aparece com nome, preço, descrição e quantidade.

## Loja e lista de compras

- **LOJ-01** – A pesquisa da loja filtra os produtos pelo nome digitado.
- **LOJ-02** – Cada produto mostra nome e preço no formato "$ 150".
- **LOJ-03** – "Adicionar a lista" leva para a lista de compras (`/minhaListaDeProdutos`) com o produto e "Total: 1".
- **LOJ-04** – O botão "+" aumenta a quantidade do item ("Total: 2", ...).
- **LOJ-05** – "Limpar Lista" esvazia a lista e mostra "Seu carrinho está vazio".

## Carrinhos (API)

- **CAR-01** – Cada usuário tem **no máximo um carrinho**, vinculado ao token usado.
- **CAR-02** – Cadastrar o carrinho **reduz** o estoque (quantidade) de cada produto.
- **CAR-03** – Concluir a compra exclui o carrinho. Cancelar a compra exclui o carrinho e **devolve** os produtos ao estoque.

## Ambiente de teste

- **AMB-01** – Os testes usam a API local (`http://localhost:3000`, Docker) no lugar da pública. Respostas 429 ("limite de requisições") indicam que o teste chamou o servidor público: é problema de **ambiente**, não do sistema.
- **AMB-02** – A base local começa vazia a cada subida do container. Os testes criam a própria massa (usuários e produtos) e a apagam no fim.
