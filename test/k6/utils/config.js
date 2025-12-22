// Configurações para testes k6
export const BASE_URL = __ENV.API_URL || 'http://localhost:3000'
export const REST_BASE_URL = `${BASE_URL}/api/rest`
export const GRAPHQL_BASE_URL = `${BASE_URL}/api/graphql`

// Usuário de teste
export const TEST_USER = {
	name: 'Test User K6',
	email: `test-k6-${Date.now()}@example.com`,
	password: 'password123',
	phone: '11999999999',
}

// Produto de teste
export const TEST_PRODUCT = {
	name: 'Product K6 Test',
	price: '99.99',
	description: 'Produto criado para teste de performance com k6',
}

// Thresholds padrão
export const DEFAULT_THRESHOLDS = {
	http_req_duration: ['p(95)<500'], // 95% das requisições devem ser < 500ms
	http_req_failed: ['rate<0.1'], // Taxa de erro deve ser < 10%
}

// Opções de teste de carga (Load Test)
export const LOAD_TEST_OPTIONS = {
	stages: [
		{ duration: '15s', target: 10 }, // Subir para 10 usuários em 15s
		{ duration: '15s', target: 10 }, // Manter 10 usuários por 15 segundos
		{ duration: '15s', target: 0 }, // Reduzir para 0 usuários em 15s
	],
	thresholds: DEFAULT_THRESHOLDS,
}

// Opções de teste de estresse (Stress Test)
export const STRESS_TEST_OPTIONS = {
	stages: [
		{ duration: '1m', target: 20 }, // Subir para 20 usuários
		{ duration: '2m', target: 20 }, // Manter 20 usuários
		{ duration: '1m', target: 50 }, // Subir para 50 usuários
		{ duration: '2m', target: 50 }, // Manter 50 usuários
		{ duration: '1m', target: 0 }, // Reduzir para 0
	],
	thresholds: DEFAULT_THRESHOLDS,
}

// Opções de teste de pico (Spike Test)
export const SPIKE_TEST_OPTIONS = {
	stages: [
		{ duration: '10s', target: 10 }, // Subir para 10 usuários
		{ duration: '30s', target: 100 }, // Pico de 100 usuários
		{ duration: '10s', target: 10 }, // Voltar para 10 usuários
		{ duration: '30s', target: 0 }, // Reduzir para 0
	],
	thresholds: {
		http_req_duration: ['p(95)<1000'], // Mais tolerante em picos
		http_req_failed: ['rate<0.2'],
	},
}
