import http from 'k6/http'
import { sleep, group } from 'k6'
import { Trend } from 'k6/metrics'
import { REST_BASE_URL, LOAD_TEST_OPTIONS } from '../utils/config.js'
import {
	checkStatus2xx,
	checkBodyHasField,
	extractToken,
	authHeaders,
	defaultHeaders,
	generateRandomUser,
	generateRandomProduct,
} from '../utils/helpers.js'

// Custom Trends para métricas específicas
const loginDuration = new Trend('login_duration')
const createProductDuration = new Trend('create_product_duration')
const listUsersDuration = new Trend('list_users_duration')

export const options = LOAD_TEST_OPTIONS

// Token será armazenado aqui após o setup
let authToken

export function setup() {
	// Registra e faz login de um usuário para obter token
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

	// Adiciona métrica customizada de duração do login
	loginDuration.add(loginRes.timings.duration)

	const token = extractToken(loginRes)
	console.log('Token obtido no setup:', token ? 'Sim' : 'Não')

	return { token }
}

export default function (data) {
	authToken = data.token

	// Group: Operações de Usuário
	group('User Operations', function () {
		// 1. Listar usuários
		const listUsersRes = http.get(`${REST_BASE_URL}/users`, {
			headers: authHeaders(authToken),
		})
		checkStatus2xx(listUsersRes, 'GET /users')
		listUsersDuration.add(listUsersRes.timings.duration)
		sleep(1)
	})

	// Group: Operações de Produto
	group('Product Operations', function () {
		// 2. Criar produto
		const product = generateRandomProduct()
		const createProductRes = http.post(
			`${REST_BASE_URL}/products`,
			JSON.stringify(product),
			{ headers: authHeaders(authToken) }
		)
		checkStatus2xx(createProductRes, 'POST /products')
		createProductDuration.add(createProductRes.timings.duration)

		// Extrair ID do produto criado (Reaproveitamento de resposta)
		let productId
		try {
			const body = JSON.parse(createProductRes.body)
			productId = body.id
		} catch (e) {
			console.error('Erro ao extrair productId:', e)
		}

		sleep(1)

		// 3. Listar produtos
		const listProductsRes = http.get(`${REST_BASE_URL}/products`, {
			headers: authHeaders(authToken),
		})
		checkStatus2xx(listProductsRes, 'GET /products')
		sleep(1)

		// 4. Buscar produto específico (se temos ID)
		if (productId) {
			const getProductRes = http.get(`${REST_BASE_URL}/products/${productId}`, {
				headers: authHeaders(authToken),
			})
			checkStatus2xx(getProductRes, 'GET /products/:id')
			sleep(1)

			// 5. Atualizar produto
			const updateProductRes = http.put(
				`${REST_BASE_URL}/products/${productId}`,
				JSON.stringify({ ...product, price: '149.99' }),
				{ headers: authHeaders(authToken) }
			)
			checkStatus2xx(updateProductRes, 'PUT /products/:id')
			sleep(1)
		}
	})

	sleep(1)
}

export function teardown(data) {
	console.log('Teste de carga REST finalizado')
}
