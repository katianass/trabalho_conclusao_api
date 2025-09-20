import request from 'supertest'
import { expect, assert, should, use } from 'chai'
import chaiExclude from "chai-exclude"
import { StatusCodes } from "http-status-codes"

import app from '#app/app.js'

use(chaiExclude)

const massaDadosUserRegister = {
    "name": "Katiana",
    "email": "katiana@gmail.com",
    "password": "123456",
    "phone": "6299990000"
}

describe('Teste registrando usuario para autenticação', () => {
    it('Valida campos obrigatorios POST /api/rest/auth/register', async () => {
        const respRegister = await request(app)
            .post('/api/rest/auth/register')
            .send({})

        expect(respRegister.statusCode).to.equal(StatusCodes.BAD_REQUEST)

        const messages = respRegister.body.errors.map(e => e.message)
        expect(messages).to.include("The field name is required")
        expect(messages).to.include("The field email is required")
        expect(messages).to.include("The field email is invalid")
        expect(messages).to.include("The field password is required")
        expect(messages).to.include("The field phone is required")
    })

    it('Valida que usuario já existe POST /api/rest/auth/register', async () => {
        // Aqui tem duas chamadas de api, para simula a validação de email unico
        await request(app)
            .post('/api/rest/auth/register')
            .send(massaDadosUserRegister)

        const respRegister = await request(app)
            .post('/api/rest/auth/register')
            .send(massaDadosUserRegister)

        expect(respRegister.statusCode).to.equal(StatusCodes.CONFLICT)
        expect(respRegister.body.error).to.equal('The email already exists')

    })

    it('Valida cadastro com sucesso POST /api/rest/auth/register', async () => {
        const respRegister = await request(app)
            .post('/api/rest/auth/register')
            .send({
                "name": "Katiana Sucess",
                "email": "katiana-sucess@gmail.com",
                "password": "123456",
                "phone": "6299990000"
            })

        expect(respRegister.statusCode).to.equal(StatusCodes.CREATED)
        expect(respRegister.body.message).to.equal('User registered successfully!')
    })
})

describe('Teste login', () => {
    it('Valida campos obrigatorios POST /api/rest/auth/login', async () => {
        const respLogin = await request(app)
            .post('/api/rest/auth/login')
            .send({})

        expect(respLogin.statusCode).to.equal(StatusCodes.BAD_REQUEST)
        const messages = respLogin.body.errors.map(e => e.message)
        expect(messages).to.include("The field password is required")
        expect(messages).to.include("The field email is required")
        expect(messages).to.include("The field email is invalid")
    })

    it('Valida não authorizado/inexistente POST /api/rest/auth/login', async () => {
        const respLogin = await request(app)
            .post('/api/rest/auth/login')
            .send({
                email: "user-not-found@gmail.com",
                password: "123456"
            })

        expect(respLogin.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respLogin.body.error).to.equal('Incorrect email or password')
    })

    it('Valida login com sucesso POST /api/rest/auth/login', async () => {
        const userLogin = {
            "name": "Katiana Login Success",
            "email": "katiana-login-success@gmail.com",
            "password": "123456",
            "phone": "6299990000"
        }
        await request(app)
            .post('/api/rest/auth/register')
            .send(userLogin)

        const respLogin = await request(app)
            .post('/api/rest/auth/login')
            .send({
                email: userLogin.email,
                password: userLogin.password
            })

        expect(respLogin.statusCode).to.equal(StatusCodes.OK)
        expect(respLogin.body.message).to.equal('Login successful')
        expect(respLogin.body).to.have.property("token")
    })
})