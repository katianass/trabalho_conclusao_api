import request from 'supertest'
import { expect, use } from 'chai'
import chaiExclude from "chai-exclude"
import { StatusCodes } from "http-status-codes"

import app from '#app/app.js'
import { registerMutation, loginMutation } from './../fixture/request/auth/register.js'

use(chaiExclude)

describe('Teste GraphQL -> Register', () => {
    it('Valida cadastro com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .send({ query: registerMutation })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('register')
        expect(response.body.data.register).to.equal('User created')
    })
})

describe('Teste GraphQL -> Login', () => {
    // TODO validar quando o token estiver expirado ou invalido
    // it('Valida não authorizado/inexistente', async () => {
    // })

    it('Valida login com sucesso', async () => {
        await request(app)
            .post('/api/graphql')
            .send({ query: registerMutation })

        const response = await request(app)
            .post('/api/graphql')
            .send({ query: loginMutation })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('login')
        expect(response.body.data.login).to.have.property('message')
        expect(response.body.data.login.message).to.equal('Login successful')
    })
})