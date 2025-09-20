import request from 'supertest'
import { expect, assert, should, use } from 'chai'
import chaiExclude from "chai-exclude"
import { StatusCodes } from "http-status-codes"
import { faker } from '@faker-js/faker'

import app from '#app/app.js'

use(chaiExclude)

let userToken = null;

describe('Teste Create User', () => {
    before(async () => {
        // Cria um user para autenticar
        const userLogin = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 10 }),
            phone: faker.phone.number(),
        }

        await request(app)
            .post('/api/rest/auth/register')
            .send(userLogin)

        // Autentica e seta o token na variavel global 'userToken'
        const respLogin = await request(app)
            .post('/api/rest/auth/login')
            .send({
                email: userLogin.email,
                password: userLogin.password
            })

        userToken = respLogin.body.token
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

// describe('Teste List User', () => {
//     // before()
//     // beforeEach()

//     it('Valida que error de não autenticado', async () => {

//     })

//     it('Valida campos obrigatorios', async () => {

//     })

//     it('Valida cadastro com sucesso', async () => {

//     })
// })

// describe('Teste Show User', () => {
//     // before()
//     // beforeEach()

//     it('Valida que error de não autenticado', async () => {

//     })

//     it('Valida campos obrigatorios', async () => {

//     })

//     it('Valida cadastro com sucesso', async () => {

//     })
// })

// describe('Teste Update User', () => {
//     // before()
//     // beforeEach()

//     it('Valida que error de não autenticado', async () => {

//     })

//     it('Valida campos obrigatorios', async () => {

//     })

//     it('Valida cadastro com sucesso', async () => {

//     })
// })

describe('Teste Delete User', () => {
    // before()
    // beforeEach()

    it('Valida error de não autenticado/token não existente', async () => {

    })

    it('Valida error de token invalido', async () => {
        
    })

    it('Valida usuario não encontrado', async () => {

    })

    it('Valida delete com sucesso', async () => {

    })
})