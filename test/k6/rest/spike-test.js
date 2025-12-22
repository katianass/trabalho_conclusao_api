import http from 'k6/http'
import { sleep } from 'k6'
import { REST_BASE_URL, SPIKE_TEST_OPTIONS } from '../utils/config.js'
import {
	checkStatus2xx,
	extractToken,
	authHeaders,
	defaultHeaders,
	generateRandomUser,
} from '../utils/helpers.js'

export const options = SPIKE_TEST_OPTIONS

let authToken

export function setup() {
	const user = generateRandomUser()

	// Registro
	http.post(`${REST_BASE_URL}/auth/register`, JSON.stringify(user), {
		headers: defaultHeaders(),
	})

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

	// Teste de pico: requisições simples e rápidas

	// Listar usuários
	const usersRes = http.get(`${REST_BASE_URL}/users`, {
		headers: authHeaders(authToken),
	})
	checkStatus2xx(usersRes, 'GET /users')

	// Listar produtos
	const productsRes = http.get(`${REST_BASE_URL}/products`, {
		headers: authHeaders(authToken),
	})
	checkStatus2xx(productsRes, 'GET /products')

	sleep(0.1) // Sleep mínimo para simular pico real
}

export function teardown(data) {
	console.log('Teste de pico REST finalizado')
}
