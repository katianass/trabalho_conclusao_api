import http from 'k6/http'
import { sleep } from 'k6'
import { REST_BASE_URL, STRESS_TEST_OPTIONS } from '../utils/config.js'
import {
	checkStatus2xx,
	extractToken,
	authHeaders,
	defaultHeaders,
	generateRandomUser,
	generateRandomProduct,
} from '../utils/helpers.js'

export const options = STRESS_TEST_OPTIONS

let authToken

export function setup() {
	const user = generateRandomUser()

	// Registro
	const registerRes = http.post(
		`${REST_BASE_URL}/auth/register`,
		JSON.stringify(user),
		{ headers: defaultHeaders() }
	)

	if (registerRes.status !== 201) {
		console.error('Falha no registro:', registerRes.body)
		return { token: null }
	}

	// Login
	const loginRes = http.post(
		`${REST_BASE_URL}/auth/login`,
		JSON.stringify({ email: user.email, password: user.password }),
		{ headers: defaultHeaders() }
	)

	return { token: extractToken(loginRes) }
}

export default function (data) {
	authToken = data.token

	// Teste de estresse: mais requisições, menor sleep

	// Criar múltiplos produtos
	for (let i = 0; i < 3; i++) {
		const product = generateRandomProduct()
		const createRes = http.post(
			`${REST_BASE_URL}/products`,
			JSON.stringify(product),
			{ headers: authHeaders(authToken) }
		)
		checkStatus2xx(createRes, `POST /products (${i + 1})`)
		sleep(0.5)
	}

	// Listar produtos múltiplas vezes
	for (let i = 0; i < 3; i++) {
		const listRes = http.get(`${REST_BASE_URL}/products`, {
			headers: authHeaders(authToken),
		})
		checkStatus2xx(listRes, `GET /products (${i + 1})`)
		sleep(0.3)
	}

	// Listar usuários
	const usersRes = http.get(`${REST_BASE_URL}/users`, {
		headers: authHeaders(authToken),
	})
	checkStatus2xx(usersRes, 'GET /users')

	sleep(0.5)
}

export function teardown(data) {
	console.log('Teste de estresse REST finalizado')
}
