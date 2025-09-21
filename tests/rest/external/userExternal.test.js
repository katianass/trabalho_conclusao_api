import request from 'supertest'
import { expect, use } from 'chai'
import chaiExclude from "chai-exclude"
import { StatusCodes } from "http-status-codes"
import { faker } from '@faker-js/faker'
import { getTokenUser } from './utils.js'

import app from '#app/app.js'

use(chaiExclude)

let userToken = null;

describe('Teste REST - Create User', () => {
    before(async () => {
        userToken = await getTokenUser()
    })
    // beforeEach()

    it('Valida error de não autenticado/token não existente', async () => {
        const respLogin = await request(app)
            .post('/api/rest/users')
            .send()

        // console.log(respLogin.body)
        expect(respLogin.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respLogin.body.error).to.equal('Token not found')
    })

    it('Valida error de token invalido', async () => {
        const respUserCreate = await request(app)
            .post('/api/rest/users')
            .set('Authorization', `Bearer Token-Invalido`)
            .send()

        // console.log(respUserCreate.body)
        expect(respUserCreate.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respUserCreate.body.error).to.equal('Token invalid')
    })

    it('Valida campos obrigatorios', async () => {
        const respUserCreate = await request(app)
            .post('/api/rest/users')
            .set('Authorization', `Bearer ${userToken}`)
            .send()
        //console.log(respUserCreate.body)
        expect(respUserCreate.statusCode).to.equal(StatusCodes.BAD_REQUEST)

        const messages = respUserCreate.body.errors.map(e => e.message)
        expect(messages).to.include("The field name is required")
        expect(messages).to.include("The field email is required")
        expect(messages).to.include("The field email is invalid")
        expect(messages).to.include("The field password is required")
        expect(messages).to.include("The field phone is required")
    })

    it('Valida cadastro com email já existente', async () => {
        const userDuplicated = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 10 }),
            phone: faker.phone.number()
        }

        await request(app)
            .post('/api/rest/users')
            .set('Authorization', `Bearer ${userToken}`)
            .send(userDuplicated)

        const respUserCreate = await request(app)
            .post('/api/rest/users')
            .set('Authorization', `Bearer ${userToken}`)
            .send(userDuplicated)

        expect(respUserCreate.statusCode).to.equal(StatusCodes.CONFLICT)
        expect(respUserCreate.body.error).to.equal('The email already exists')
    })

    it('Valida cadastro com sucesso', async () => {
        const respUserCreate = await request(app)
            .post('/api/rest/users')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 10 }),
                phone: faker.phone.number()
            })

        expect(respUserCreate.statusCode).to.equal(StatusCodes.CREATED)
        expect(respUserCreate.body.message).to.equal('User created')
    })
})

describe('Teste REST - List User', () => {
    before(async () => {
        userToken = await getTokenUser()
    })

    it('Valida error de não autenticado/token não existente', async () => {
        const respUserList = await request(app)
            .get('/api/rest/users')
            .send()

        expect(respUserList.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respUserList.body.error).to.equal('Token not found')
    })

    it('Valida error de token invalido', async () => {
        const respUserList = await request(app)
            .get('/api/rest/users')
            .set('Authorization', `Bearer meu-token-invalido`)
            .send()

        expect(respUserList.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respUserList.body.error).to.equal('Token invalid')
    })

    it('Valida listagem com sucesso', async () => {
        const respUserList = await request(app)
            .get('/api/rest/users')
            .set('Authorization', `Bearer ${userToken}`)
            .send()

        expect(respUserList.statusCode).to.equal(StatusCodes.OK)
    })
})

describe('Teste REST - Show User', () => {
    before(async () => {
        userToken = await getTokenUser()
    })

    it('Valida error de não autenticado/token não existente', async () => {
        const respUserShow = await request(app)
            .get('/api/rest/users/1')
            .send()

        expect(respUserShow.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respUserShow.body.error).to.equal('Token not found')
    })

    it('Valida error de token invalido', async () => {
        const respUserShow = await request(app)
            .get('/api/rest/users/1')
            .set('Authorization', `Bearer meu-token-invalido`)
            .send()

        expect(respUserShow.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respUserShow.body.error).to.equal('Token invalid')
    })

    it('Valida usuario não encontrado', async () => {
        const respUserShow = await request(app)
            .get('/api/rest/users/9999')
            .set('Authorization', `Bearer ${userToken}`)
            .send()

        expect(respUserShow.statusCode).to.equal(StatusCodes.NOT_FOUND)
        expect(respUserShow.body.error).to.equal('User not found')
    })

    it('Valida recuperar user com sucesso', async () => {
        const response = await request(app)
            .post('/api/rest/users')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 10 }),
                phone: faker.phone.number()
            })

        const respUserShow = await request(app)
            .get(`/api/rest/users/${response.body.data.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send()

        expect(respUserShow.statusCode).to.equal(StatusCodes.OK)
    })
})

describe('Teste REST - Update User', () => {
    before(async () => {
        userToken = await getTokenUser()
    })

    it('Valida error de não autenticado/token não existente', async () => {
        const respUserUpdate = await request(app)
            .put('/api/rest/users/1')
            .send()

        expect(respUserUpdate.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respUserUpdate.body.error).to.equal('Token not found')
    })

    it('Valida error de token invalido', async () => {
        const respUserUpdate = await request(app)
            .put('/api/rest/users/1')
            .set('Authorization', `Bearer meu-token-invalido`)
            .send()

        expect(respUserUpdate.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respUserUpdate.body.error).to.equal('Token invalid')
    })

    it('Valida usuario não encontrado', async () => {
        const respUserUpdate = await request(app)
            .put('/api/rest/users/9999')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 10 }),
                phone: faker.phone.number(),
            })

        expect(respUserUpdate.statusCode).to.equal(StatusCodes.NOT_FOUND)
        expect(respUserUpdate.body.error).to.equal('User not found')
    })

    it('Valida atualização com sucesso', async () => {
        const response = await request(app)
            .post('/api/rest/users')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 10 }),
                phone: faker.phone.number()
            })

        const respUserUpdate = await request(app)
            .put(`/api/rest/users/${response.body.data.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 10 }),
                phone: faker.phone.number(),
            })

        expect(respUserUpdate.statusCode).to.equal(StatusCodes.OK)
    })
})

describe('Teste REST - Delete User', () => {
    before(async () => {
        userToken = await getTokenUser()
    })

    it('Valida error de não autenticado/token não existente', async () => {
        const respUserDelete = await request(app)
            .delete('/api/rest/users/1')
            .send()

        expect(respUserDelete.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respUserDelete.body.error).to.equal('Token not found')
    })

    it('Valida error de token invalido', async () => {
        const respUserDelete = await request(app)
            .delete('/api/rest/users/1')
            .set('Authorization', `Bearer meu-token-invalido`)
            .send()

        expect(respUserDelete.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(respUserDelete.body.error).to.equal('Token invalid')
    })

    it('Valida usuario não encontrado', async () => {
        const respUserDelete = await request(app)
            .delete('/api/rest/users/9999')
            .set('Authorization', `Bearer ${userToken}`)
            .send()

        expect(respUserDelete.statusCode).to.equal(StatusCodes.NOT_FOUND)
        expect(respUserDelete.body.error).to.equal('User not found')
    })

    it('Valida delete com sucesso', async () => {
        const response = await request(app)
            .post('/api/rest/users')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 10 }),
                phone: faker.phone.number()
            })

        const respUserDelete = await request(app)
            .delete(`/api/rest/users/${response.body.data.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send()

        expect(respUserDelete.statusCode).to.equal(StatusCodes.NO_CONTENT)
    })
})