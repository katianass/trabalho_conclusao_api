# Projeto Testes em API REST e GraphQL

Projeto de API Rest e GraphQL, com funcionalidade de registrar login, manipulação do usuarios (CRUD), fluxo de produtos tambem (CRUD), as rotas estão disponibilizadas com os dois tipos de API Rest e GraphQL, em apenas um projeto nodejs

## Tecnologias
- Node.js
- Express e Express Validator
- Http Status
- Faker (Gerar dados faker)
- Mocha
- Chai
- Supertest
- Sinon (para mockar metodos)
- Banco de dados em memória (usando Map)

## Instalação

1. Clone o repositório:
   ```sh
   git clone <repo-url>
   cd api-katiana
   ```
2. Instale as dependências:
   ```sh
   npm install 
   ```

## Configuração

A principio não é necessario ter nenhuma configuração, pois sempre é referenciado um valor default caso não exista um valor definido na variavel de ambiente.
Exemplo:
```shell
const jwt = process.env.API_JWT_SECRET || 'token-exemplo'
const port = process.env.API_PORT || 3000
```
Mas é possivel criar um arquivo .env dentro da pasta /src/.env que irá reconhecer os novos valores.

## Como rodar

- Para iniciar o servidor, estamos referenciando nos scripts do arquivo package.json, sendo assim apenas utilizar `npm run start-api`
- A API Rest estará disponível em `http://localhost:3000/api/rest`
- A API GraphQL estará disponível em `http://localhost:3000/api/graphql`
- A documentação Swagger estará em `http://localhost:3000/api-docs`

## Endpoints principais

### Registro de usuário
- `POST /api/rest/auth/register`
  - Body: `{ "name": "string", "email": "string", "password": "string", "phone": "string" }`

### Login
- `POST /api/rest/auth/login`
  - Body: `{ "email": "string", "password": "string" }`

### Listar usuários
- `GET /api/rest/users`

### Visualizar apenas um usuário
- `GET /api/rest/users/:id`

### Atualizar usuário
- `PUT /api/rest/users/:id`

### Remover usuário
- `DELETE /api/rest/users/:id`

### Cria novo produto (O recurso produtos possui todas as rotas para ser manipulado)
- `POST /api/rest/products`
  - Body: `{ "name": "string", "price": "string", "description": "string" }`

### GraphQL Types, Queries e Mutations
API do GraphQL e acesse a URL `http://localhost:3000/api/graphql` para acessá-la. Para mais detalhes do schema do GraphQL pode ser conferido no arquivo `src/controllers/graphql/schema.js`

- **Types:**
  - `User`: name, email, phone
  - `Product`: name, price, description
  - `AuthToken`: message, token
- **Queries:**
  - `users`: lista todos os usuários
  - `user(id)`: retorna apenas um usuario
  - `products`: lista todos os usuários
  - `product(id)`: retorna apenas um produto

- **Mutations:**
  - `register(name, email, password, phone)`: retorna Mensagem em string
  - `login(email, password)`: retorna mensagem de sucesso + token
  - `createUser(name, email, password, phone)`: retorna mensagem de sucesso
  - `updateUser(id, name, email, password, phone)`: retorna mensagem de sucesso
  - `deleteUser(id)`: retorna mensagem de sucesso
  - `createProduct(name, price, description)`: retorna mensagem de sucesso
  - `updateProduct(id, name, price, description)`: retorna mensagem de sucesso
  - `deleteProduct(id)`: retorna mensagem de sucesso

## Regras de negócio
- Não é permitido registrar usuários duplicados com o mesmo email.
- Login exige usuário e senha para utilizar as rotas internas.
- Nas rotas de criar e atualizar usuário os campos devem ser validados
- Em rotas de buscas como show, update e delete, que precisam do registro criado previamente. Caso o registro não exista retornar 404.
- Caso não seja informado token retorna que o token não existe
- Caso o token infomado seja invalido retorna que o token é invalido

# Referencias
- [Video Youtube sobre Sinon](https://www.youtube.com/watch?v=rXoh6ZFUg-E)
- [Video Youtube sobre GraphQL](https://www.youtube.com/watch?v=-6YWAgOr9N4)
- [Video Youtube sobre GraphQL Estudos](https://www.youtube.com/watch?v=1dz48pReq_c)
- [Video Youtube sobre API Rest com Express](https://www.youtube.com/watch?v=ycIxWTEI908)
- [Video Youtube sobre API Rest](https://www.youtube.com/watch?v=hHM-hr9q4mo)