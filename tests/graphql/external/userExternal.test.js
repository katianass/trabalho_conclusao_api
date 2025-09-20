import request from 'supertest'
import { expect, use } from 'chai'
import chaiExclude from "chai-exclude"
import { StatusCodes } from "http-status-codes"

import app from '#app/app.js'
import { 
    userData,
    createUserMutation,
    loginMutation,
    deleteUserMutation,
    listUserQuery,
    showUserQuery,
    updateUserMutation
} from './../fixture/request/user/user.js'

import { getTokenUser } from './utils.js'

let userToken = await getTokenUser()

use(chaiExclude)

describe('Teste GraphQL -> Validate mutation Not authenticated (todas rotas para users)', () => {
    it('Mutation create user', async () => {
        let response = await request(app).post('/api/graphql').send({ query: createUserMutation })
        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body.errors[0].message).to.equal('Not authenticated')
    })

    it('Mutation list user', async () => {
        let response = await request(app).post('/api/graphql').send({ query: listUserQuery })
        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body.errors[0].message).to.equal('Not authenticated')
    })

    it('Mutation show user', async () => {
        let response = await request(app).post('/api/graphql').send({ query: showUserQuery(1) })
        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body.errors[0].message).to.equal('Not authenticated')
    })

    it('Mutation update user', async () => {
        let response = await request(app).post('/api/graphql').send({ query: updateUserMutation(1) })
        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body.errors[0].message).to.equal('Not authenticated')
    })

    it('Mutation delete user', async () => {
        let response = await request(app).post('/api/graphql').send({ query: deleteUserMutation(1) })
        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body.errors[0].message).to.equal('Not authenticated')
    })
})

describe('Teste GraphQL -> User Create', () => {
    it('Valida cadastro com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: createUserMutation })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('createUser')
        expect(response.body.data.createUser).to.equal('User created')
    })
})

describe('Teste GraphQL -> User List', () => {
    it('Valida listagem com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: listUserQuery })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('users')
    })
})

describe('Teste GraphQL -> User Show', () => {
    it('Valida recuperar usuario not found', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: showUserQuery(999) })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.errors[0]).to.have.property('message')
        expect(response.body.errors[0].message).to.equal('User not found')
    })

    it('Valida recuperar usuario com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: showUserQuery(1) })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('user')
        expect(response.body.data.user.name).to.equal(userData.name)
        expect(response.body.data.user.email).to.equal(userData.email)
        expect(response.body.data.user.phone).to.equal(userData.phone)
    })
})

describe('Teste GraphQL -> User Update', () => {
    it('Valida update com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: updateUserMutation(1) })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('updateUser')
        expect(response.body.data.updateUser).to.equal('User update successful')
    })
})

describe('Teste GraphQL -> User Delete', () => {
    it('Valida delete usuario not found', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: deleteUserMutation(999) })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.errors[0]).to.have.property('message')
        expect(response.body.errors[0].message).to.equal('User not found')
    })

    it('Valida delete com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: deleteUserMutation(1) })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('deleteUser')
        expect(response.body.data.deleteUser).to.equal('User removed')
    })
})
