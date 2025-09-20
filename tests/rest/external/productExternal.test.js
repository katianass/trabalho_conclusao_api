import request from 'supertest'
import { expect, use } from 'chai'
import chaiExclude from "chai-exclude"
import { StatusCodes } from "http-status-codes"
import { faker } from '@faker-js/faker'
import { getTokenUser } from './utils.js'

import app from '#app/app.js'

use(chaiExclude)

let userToken = await getTokenUser()

// TODO validar autenticação de todas as rotas
// TODO POST products
// TODO GET products
// TODO GET products/:id
// TODO PUT products/:id
// TODO DELETE products/:id
describe('Teste autenticação/token todas rotas products', () => {
    it('POST /api/rest/products - create products', async () => {
        let response = await request(app).post('/api/rest/products').send()
        expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(response.body.error).to.equal('Token not found')

        response = await request(app).post('/api/rest/products').set('Authorization', `Bearer meu-token-invalido`).send()
        expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(response.body.error).to.equal('Token invalid')
    })

    it('GET /api/rest/products - list products', async () => {
        let response = await request(app).get('/api/rest/products').send()
        expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(response.body.error).to.equal('Token not found')

        response = await request(app).get('/api/rest/products').set('Authorization', `Bearer meu-token-invalido`).send()
        expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(response.body.error).to.equal('Token invalid')
    })

    it('GET /api/rest/products/:id - show products', async () => {
        let response = await request(app).get('/api/rest/products/1').send()
        expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(response.body.error).to.equal('Token not found')

        response = await request(app).get('/api/rest/products/1').set('Authorization', `Bearer meu-token-invalido`).send()
        expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(response.body.error).to.equal('Token invalid')
    })

    it('PUT /api/rest/products/:id - update products', async () => {
        let response = await request(app).put('/api/rest/products/1').send()
        expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(response.body.error).to.equal('Token not found')

        response = await request(app).put('/api/rest/products/1').set('Authorization', `Bearer meu-token-invalido`).send()
        expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(response.body.error).to.equal('Token invalid')
    })

    it('DELETE /api/rest/products/:id - delete products', async () => {
        let response = await request(app).delete('/api/rest/products/1').send()
        expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(response.body.error).to.equal('Token not found')

        response = await request(app).delete('/api/rest/products/1').set('Authorization', `Bearer meu-token-invalido`).send()
        expect(response.statusCode).to.equal(StatusCodes.UNAUTHORIZED)
        expect(response.body.error).to.equal('Token invalid')
    })
})

describe('Teste products not found', () => {
    it('GET /api/rest/products/:id - show products', async () => {
        const response = await request(app).get('/api/rest/products/999').set('Authorization', `Bearer ${userToken}`).send()
        expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND)
        expect(response.body.error).to.equal('Product not found')
    })

    it('PUT /api/rest/products/:id - update products', async () => {
        const response = await request(app)
            .put('/api/rest/products/999')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: "Produto not found",
                price: "39.78",
                description: "Description Produto not found"
            })
        expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND)
        expect(response.body.error).to.equal('Product not found')
    })

    it('DELETE /api/rest/products/:id - delete products', async () => {
        const response = await request(app).delete('/api/rest/products/999').set('Authorization', `Bearer ${userToken}`).send()
        expect(response.statusCode).to.equal(StatusCodes.NOT_FOUND)
        expect(response.body.error).to.equal('Product not found')
    })
})

describe('Teste List Product', () => {
    it('Valida listagem com sucesso', async () => {
        const response = await request(app)
            .get('/api/rest/products')
            .set('Authorization', `Bearer ${userToken}`)
            .send()

        expect(response.statusCode).to.equal(StatusCodes.OK)
    })
})

describe('Teste Show Product', () => {
    it('Valida recupera produto com sucesso', async () => {
        const productNew = {
            name: "Product delete success",
            price: "40.50",
            description: "Description Product delete succes"
        }

        await request(app)
            .post('/api/rest/products')
            .set('Authorization', `Bearer ${userToken}`)
            .send(productNew)

        const response = await request(app)
            .get('/api/rest/products/1')
            .set('Authorization', `Bearer ${userToken}`)
            .send()

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.include({
            name: productNew.name,
            price: productNew.price,
            description: productNew.description
        });
    })
})

describe('Teste Delete Product', () => {
    it('Valida delete com sucesso', async () => {
        await request(app)
            .post('/api/rest/products')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: "Product delete success",
                price: "40.50",
                description: "Description Product delete succes"
            })

        const response = await request(app)
            .delete('/api/rest/products/1')
            .set('Authorization', `Bearer ${userToken}`)
            .send()

        expect(response.statusCode).to.equal(StatusCodes.NO_CONTENT)
    })
})