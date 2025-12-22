# Testes de Performance com k6

Este diretório contém testes de performance para a API utilizando [k6](https://k6.io/).

## Pré-requisitos

### Instalação do k6

O k6 não é um pacote npm, é uma ferramenta standalone que precisa ser instalada no sistema.

**Windows (via Chocolatey):**

```bash
choco install k6
```

**Windows (via Winget):**

```bash
winget install k6 --source winget
```

**macOS (via Homebrew):**

```bash
brew install k6
```

**Linux (Debian/Ubuntu):**

```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

Para mais opções de instalação, consulte: <https://k6.io/docs/get-started/installation/>

---

## 🚀 Como Executar os Testes

Certifique-se de que a API está rodando antes de executar os testes:

```bash
npm run start-api
```

### Testes REST

```bash
# Teste de carga
npm run k6:rest-load

# Teste de estresse
npm run k6:rest-stress

# Teste de pico
npm run k6:rest-spike

# Todos os testes REST
npm run k6:all-rest
```

---

## 📊 Gerando Relatórios HTML

### Opção 1: Relatório HTML com k6

```bash
# Gerar relatório HTML diretamente
k6 run --out json=test/k6/reports/results.json test/k6/rest/load-test.js

# Ou usando o script npm (recomendado)
npm run k6:rest-load-report
npm run k6:rest-stress-report
npm run k6:rest-spike-report
```

### Opção 2: Usando k6-reporter

Instale o conversor de relatórios:

```bash
npm install -g k6-reporter
```

Execute o teste e converta para HTML:

```bash
# 1. Gerar JSON
k6 run --out json=test/k6/reports/results.json test/k6/rest/load-test.js

# 2. Converter para HTML
k6-reporter test/k6/reports/results.json --output test/k6/reports/report.html
```

### Opção 3: Relatório Detalhado (recomendado)

Execute o teste e gere o relatório HTML automaticamente:

```bash
# REST API
npm run k6:rest-load-report
npm run k6:rest-stress-report
npm run k6:rest-spike-report

```

Os relatórios serão salvos em `test/k6/reports/` com:

- ✅ Resumo executivo do teste
- ✅ Métricas HTTP detalhadas (min, avg, p90, p95, max)
- ✅ Métricas customizadas (Trends)
- ✅ Status dos thresholds
- ✅ Avaliação de performance
- ✅ Interface visual moderna e responsiva

**Exemplo de arquivos gerados:**

- `test/k6/reports/rest-load.json` (dados brutos)
- `test/k6/reports/rest-load.html` (relatório visual)

Abra o arquivo `.html` no navegador para visualizar! 🌐

---

## Tipos de Teste

### Load Test (Teste de Carga)

Avalia o comportamento do sistema sob carga esperada normal.

- Aumenta gradualmente os usuários virtuais
- Mantém um nível constante por um período
- Reduz gradualmente

### Stress Test (Teste de Estresse)

Testa os limites do sistema aumentando a carga além da capacidade normal.

- Aumenta progressivamente a carga
- Identifica o ponto de quebra
- Verifica recuperação do sistema

### Spike Test (Teste de Pico)

Simula aumentos súbitos e dramáticos na carga.

- Aumenta rapidamente para um pico alto
- Mantém por curto período
- Retorna ao normal

## Configurações

As configurações dos testes estão em [`tests/k6/utils/config.js`](tests/k6/utils/config.js):

- **BASE_URL**: URL base da API (padrão: `http://localhost:3000`)
- **Thresholds**: Limites de performance aceitáveis
  - `http_req_duration`: 95% das requisições devem ser < 500ms
  - `http_req_failed`: Taxa de erro deve ser < 10%

Você pode sobrescrever a URL da API via variável de ambiente:

```bash
API_URL=http://localhost:3000 k6 run tests/k6/rest/load-test.js
```

## Métricas

O k6 reporta automaticamente várias métricas:

- **http_req_duration**: Tempo de resposta das requisições
- **http_req_failed**: Taxa de falha das requisições
- **http_reqs**: Total de requisições realizadas
- **vus**: Número de usuários virtuais ativos
- **iterations**: Número de iterações completadas

## Resultados

Após executar um teste, você verá um resumo com:

- ✓ Checks que passaram/falharam
- Métricas de performance
- Status dos thresholds
- Estatísticas de tempo de resposta (min, med, avg, max, p95, p99)

## Exemplos de Uso

### Teste rápido de carga

```bash
npm run k6:rest-load
```

### Teste personalizado com mais VUs

```bash
k6 run --vus 50 --duration 30s tests/k6/rest/load-test.js
```

### Executar com relatório JSON

```bash
k6 run --out json=results.json tests/k6/rest/load-test.js
```

## Troubleshooting

### API não está respondendo

Verifique se a API está rodando em `http://localhost:3000`:

```bash
npm run start-api
```

### Erros de autenticação

Os testes criam usuários automaticamente no setup. Se houver problemas:

- Verifique se as rotas de registro e login estão funcionando
- Verifique os logs do k6 para ver detalhes do erro

### Thresholds falhando

Se os thresholds estiverem falhando constantemente:

- Ajuste os valores em [`config.js`](tests/k6/utils/config.js)
- Investigue gargalos de performance na API
- Considere otimizações no código

## Recursos Adicionais

- [Documentação oficial do k6](https://k6.io/docs/)
- [k6 Examples](https://k6.io/docs/examples/)
- [k6 Best Practices](https://k6.io/docs/testing-guides/test-types/)

## 📊 Conceitos de Performance Testing Implementados

Este projeto implementa os seguintes conceitos avançados de testes de performance com k6:

### ✅ Conceitos Implementados

| Conceito | Status | Localização no Código |
|----------|--------|----------------------|
| **Thresholds** | ✅ Implementado | [`utils/config.js`](utils/config.js) |
| **Checks** | ✅ Implementado | [`utils/helpers.js`](utils/helpers.js) |
| **Helpers** | ✅ Implementado | [`utils/helpers.js`](utils/helpers.js) |
| **Trends** | ✅ Implementado | [`rest/load-test.js`](rest/load-test.js) |
| **Faker/Gerador de Dados** | ✅ Implementado | [`utils/helpers.js`](utils/helpers.js) |
| **Variáveis de Ambiente** | ✅ Implementado | [`utils/config.js`](utils/config.js) |
| **Stages** | ✅ Implementado | [`utils/config.js`](utils/config.js) |
| **Reaproveitamento de Resposta** | ✅ Implementado | [`rest/load-test.js`](rest/load-test.js) |
| **Token de Autenticação** | ✅ Implementado | [`rest/load-test.js`](rest/load-test.js) |
| **Groups** | ✅ Implementado | [`rest/load-test.js`](rest/load-test.js) |
| **Data-driven Testing** | ✅ Implementado | [`utils/helpers.js`](utils/helpers.js) |

---

## 📁 Estrutura do Projeto

```test/k6/
├── rest/                 # Testes para API REST
│   ├── load-test.js     # Teste de carga
│   ├── stress-test.js   # Teste de estresse
│   └── spike-test.js    # Teste de pico
└── utils/               # Utilitários compartilhados
    ├── config.js        # Configurações e opções de teste
    └── helpers.js       # Funções auxiliares
```

---

## 🎯 Detalhamento dos Conceitos Implementados

### 1. **Thresholds** (Limites de Performance)

**O que é:** Define critérios de sucesso/falha para o teste baseado em métricas.

**Onde está implementado:**

- Arquivo: [`utils/config.js`](utils/config.js) - linhas 21-24, 36, 58-61

**Código:**

```javascript
export const DEFAULT_THRESHOLDS = {
  http_req_duration: ['p(95)<500'], // 95% das requisições < 500ms
  http_req_failed: ['rate<0.1'],    // Taxa de erro < 10%
}
```

**Como funciona:**

- Se 95% das requisições demorarem mais de 500ms → teste falha ❌
- Se mais de 10% das requisições falharem → teste falha ❌

---

### 2. **Checks** (Validações)

**O que é:** Validações que verificam se as respostas estão corretas, mas não interrompem o teste.

**Onde está implementado:**

- Arquivo: [`utils/helpers.js`](utils/helpers.js) - linhas 1-45
- Uso: [`rest/load-test.js`](rest/load-test.js) - linhas 58, 71, 84, 94, 103

**Código:**

```javascript
export function checkStatus2xx(response, name = 'request') {
  return check(response, {
    [`${name}: status é 2xx`]: (r) => r.status >= 200 && r.status < 300,
  })
}
```

**Como funciona:**

- Verifica se a resposta tem status 2xx (sucesso)
- Registra passa/falha mas continua o teste
- Aparece no relatório final como "✓ checks"

---

### 3. **Helpers** (Funções Auxiliares)

**O que é:** Funções reutilizáveis que simplificam o código dos testes.

**Onde está implementado:**

- Arquivo: [`utils/helpers.js`](utils/helpers.js) - arquivo completo

**Funções disponíveis:**

```javascript
// Validações
checkStatus2xx()       // Verifica status 2xx
checkStatus()          // Verifica status específico
checkDuration()        // Verifica duração
checkBodyHasField()    // Verifica campo no body

// Autenticação
extractToken()         // Extrai token JWT
authHeaders()          // Cria headers com token
defaultHeaders()       // Headers padrão

// Geradores de dados
generateUniqueEmail()  // Gera email único
generateRandomUser()   // Gera usuário aleatório
generateRandomProduct()// Gera produto aleatório
```

---

### 4. **Trends** (Métricas Customizadas)

**O que é:** Métricas personalizadas para rastrear valores ao longo do tempo.

**Onde está implementado:**

- Arquivo: [`rest/load-test.js`](rest/load-test.js) - linhas 4, 16-18, 42, 59, 72

**Código:**

```javascript
import { Trend } from 'k6/metrics'

const loginDuration = new Trend('login_duration')
const createProductDuration = new Trend('create_product_duration')
const listUsersDuration = new Trend('list_users_duration')

// Uso:
loginDuration.add(loginRes.timings.duration)
```

**Como funciona:**

- Cria métricas específicas (ex: tempo de login)
- Calcula min, max, avg, percentis automaticamente
- Aparece separado no relatório final

---

### 5. **Faker/Gerador de Dados**

**O que é:** Geração dinâmica de dados de teste para simular cenários reais.

**Onde está implementado:**

- Arquivo: [`utils/helpers.js`](utils/helpers.js) - linhas 75-109
- Arquivo: [`utils/config.js`](utils/config.js) - linhas 6-19

**Código:**

```javascript
export function generateRandomUser() {
  return {
    name: `Test User ${Date.now()}`,
    email: `test-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`,
    password: 'password123',
    phone: `119${Math.floor(Math.random() * 100000000)}`,
  }
}

export function generateRandomProduct() {
  return {
    name: `Product ${Date.now()}`,
    price: (Math.random() * 1000).toFixed(2),
    description: `Descrição gerada em ${new Date().toISOString()}`,
  }
}
```

**Como funciona:**

- Gera dados únicos em cada execução
- Evita conflitos (ex: email duplicado)
- Simula comportamento de usuários reais

---

### 6. **Variáveis de Ambiente**

**O que é:** Permite configurar testes sem alterar código.

**Onde está implementado:**

- Arquivo: [`utils/config.js`](utils/config.js) - linha 2

**Código:**

```javascript
export const BASE_URL = __ENV.API_URL || 'http://localhost:3000'
```

**Como usar:**

```bash
# Padrão (localhost)
k6 run test/k6/rest/load-test.js

# Ambiente customizado
API_URL=https://api.producao.com k6 run test/k6/rest/load-test.js
```

---

### 7. **Stages** (Fases do Teste)

**O que é:** Define como a carga aumenta/diminui ao longo do tempo.

**Onde está implementado:**

- Arquivo: [`utils/config.js`](utils/config.js) - linhas 27-36, 39-47, 51-59

**Código:**

```javascript
export const LOAD_TEST_OPTIONS = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp-up: 0→10 usuários
    { duration: '1m', target: 10 },   // Sustentação: 10 usuários
    { duration: '30s', target: 0 },   // Ramp-down: 10→0 usuários
  ],
  thresholds: DEFAULT_THRESHOLDS,
}
```

**Tipos de teste:**

- **Load Test:** Aumenta gradualmente (10 VUs)
- **Stress Test:** Aumenta progressivamente (20→50 VUs)
- **Spike Test:** Pico repentino (10→100→10 VUs)

---

### 8. **Reaproveitamento de Resposta**

**O que é:** Usa dados de uma resposta em requisições seguintes.

**Onde está implementado:**

- Arquivo: [`rest/load-test.js`](rest/load-test.js) - linhas 35-44, 73-79, 90-108

**Código:**

```javascript
// 1. Criar produto e extrair ID
const createProductRes = http.post(...)
const body = JSON.parse(createProductRes.body)
const productId = body.id  // ← Extrai ID da resposta

// 2. Usar ID para buscar produto específico
const getProductRes = http.get(`${REST_BASE_URL}/products/${productId}`)

// 3. Usar ID para atualizar produto
const updateProductRes = http.put(`${REST_BASE_URL}/products/${productId}`, ...)
```

**Como funciona:**

- Cria produto → extrai ID
- Usa ID para GET/PUT/DELETE
- Simula fluxo real de usuário

---

### 9. **Token de Autenticação**

**O que é:** Gerenciamento de autenticação JWT em múltiplas requisições.

**Onde está implementado:**

- Arquivo: [`rest/load-test.js`](rest/load-test.js) - linhas 23-44, 54-106
- Arquivo: [`utils/helpers.js`](utils/helpers.js) - linhas 48-67

**Código:**

```javascript
// Setup: Obtém token uma vez
export function setup() {
  const user = generateRandomUser()
  
  // Registro
  http.post(`${REST_BASE_URL}/auth/register`, ...)
  
  // Login e extração de token
  const loginRes = http.post(`${REST_BASE_URL}/auth/login`, ...)
  const token = extractToken(loginRes)
  
  return { token }  // ← Token compartilhado
}

// Teste: Usa token em todas requisições
export default function (data) {
  const authToken = data.token
  
  http.get(`${REST_BASE_URL}/users`, {
    headers: authHeaders(authToken)  // ← Bearer Token
  })
}
```

**Como funciona:**

- `setup()`: Executa 1x, obtém token
- `default()`: Executa N vezes, usa o mesmo token
- Simula sessão autenticada de usuário

---

### 10. **Groups** (Agrupamento)

**O que é:** Organiza requisições em grupos lógicos para métricas mais claras.

**Onde está implementado:**

- Arquivo: [`rest/load-test.js`](rest/load-test.js) - linhas 54-66, 68-108

**Código:**

```javascript
import { group } from 'k6'

export default function (data) {
  group('User Operations', function () {
    const listUsersRes = http.get(`${REST_BASE_URL}/users`, ...)
    checkStatus2xx(listUsersRes, 'GET /users')
  })

  group('Product Operations', function () {
    const createProductRes = http.post(`${REST_BASE_URL}/products`, ...)
    const listProductsRes = http.get(`${REST_BASE_URL}/products`, ...)
  })
}
```

**Como funciona:**

- Agrupa requisições relacionadas
- Métricas separadas por grupo no relatório
- Facilita identificar gargalos específicos

---

### 11. **Data-driven Testing**

**O que é:** Testes baseados em dados, gerando cenários variados.

**Onde está implementado:**

- Arquivo: [`utils/helpers.js`](utils/helpers.js) - linhas 75-109
- Arquivo: [`rest/load-test.js`](rest/load-test.js) - linhas 24, 69

**Código:**

```javascript
// Cada VU usa dados diferentes
export default function (data) {
  const user = generateRandomUser()    // ← Dados únicos
  const product = generateRandomProduct() // ← Dados únicos
  
  // Testa com dados variados
  http.post(`${REST_BASE_URL}/products`, JSON.stringify(product), ...)
}
```

**Como funciona:**

- Cada usuário virtual gera dados únicos
- Testa API com entrada variada
- Detecta bugs relacionados a dados específicos
