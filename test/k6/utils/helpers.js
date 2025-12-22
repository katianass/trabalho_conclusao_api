import { check } from 'k6'

/**
 * Verifica se a resposta tem status 2xx
 */
export function checkStatus2xx(response, name = 'request') {
	return check(response, {
		[`${name}: status é 2xx`]: (r) => r.status >= 200 && r.status < 300,
	})
}

/**
 * Verifica se a resposta tem status específico
 */
export function checkStatus(response, expectedStatus, name = 'request') {
	return check(response, {
		[`${name}: status é ${expectedStatus}`]: (r) => r.status === expectedStatus,
	})
}

/**
 * Verifica se a resposta tem duração menor que um threshold
 */
export function checkDuration(response, maxDuration, name = 'request') {
	return check(response, {
		[`${name}: duração < ${maxDuration}ms`]: (r) =>
			r.timings.duration < maxDuration,
	})
}

/**
 * Verifica se o body da resposta contém um campo
 */
export function checkBodyHasField(response, field, name = 'request') {
	return check(response, {
		[`${name}: body contém campo '${field}'`]: (r) => {
			try {
				const body = JSON.parse(r.body)
				return body.hasOwnProperty(field)
			} catch (e) {
				return false
			}
		},
	})
}

/**
 * Extrai token da resposta de login
 */
export function extractToken(response) {
	try {
		const body = JSON.parse(response.body)
		return body.token || null
	} catch (e) {
		return null
	}
}

/**
 * Cria headers de autenticação
 */
export function authHeaders(token) {
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	}
}

/**
 * Headers padrão para requisições
 */
export function defaultHeaders() {
	return {
		'Content-Type': 'application/json',
	}
}

/**
 * Gera email único para testes
 */
export function generateUniqueEmail() {
	return `test-${Date.now()}-${Math.random()
		.toString(36)
		.substring(7)}@test.com`
}

/**
 * Gera dados de usuário aleatórios
 */
export function generateRandomUser() {
	return {
		name: `Test User ${Date.now()}`,
		email: generateUniqueEmail(),
		password: 'password123',
		phone: `119${Math.floor(Math.random() * 100000000)}`,
	}
}

/**
 * Gera dados de produto aleatórios
 */
export function generateRandomProduct() {
	return {
		name: `Product ${Date.now()}`,
		price: (Math.random() * 1000).toFixed(2),
		description: `Descrição do produto gerado em ${new Date().toISOString()}`,
	}
}
