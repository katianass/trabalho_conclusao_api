import request from 'supertest'
import { expect, use } from 'chai'
import chaiExclude from "chai-exclude"
import { StatusCodes } from "http-status-codes"

import app from '#app/app.js'
import { 
    productData,
    createProductMutation,
    deleteProductMutation,
    listProductQuery,
    showProductQuery,
    updateProductMutation
} from './../fixture/request/product/product.js'

import { getTokenUser } from './utils.js'

let userToken = await getTokenUser()

use(chaiExclude)

describe('Teste GraphQL -> Validate mutation Not authenticated (todas rotas para products)', () => {
    it('Mutation create product', async () => {
        let response = await request(app).post('/api/graphql').send({ query: createProductMutation })
        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body.errors[0].message).to.equal('Not authenticated')
    })

    it('Mutation list product', async () => {
        let response = await request(app).post('/api/graphql').send({ query: listProductQuery })
        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body.errors[0].message).to.equal('Not authenticated')
    })

    it('Mutation show product', async () => {
        let response = await request(app).post('/api/graphql').send({ query: showProductQuery(1) })
        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body.errors[0].message).to.equal('Not authenticated')
    })

    it('Mutation update product', async () => {
        let response = await request(app).post('/api/graphql').send({ query: updateProductMutation(1) })
        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body.errors[0].message).to.equal('Not authenticated')
    })

    it('Mutation delete product', async () => {
        let response = await request(app).post('/api/graphql').send({ query: deleteProductMutation(1) })
        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body.errors[0].message).to.equal('Not authenticated')
    })
})

describe('Teste GraphQL -> Product Create', () => {
    it('Valida cadastro com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: createProductMutation })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('createProduct')
        expect(response.body.data.createProduct).to.equal('Product created')
    })
})

describe('Teste GraphQL -> Product List', () => {
    it('Valida listagem com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: listProductQuery })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('products')
    })
})

describe('Teste GraphQL -> Product Show', () => {
    it('Valida recuperar produto not found', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: showProductQuery(999) })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.errors[0]).to.have.property('message')
        expect(response.body.errors[0].message).to.equal('Product not found')
    })

    it('Valida recuperar produtos com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: showProductQuery(1) })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('product')
        expect(response.body.data.product.name).to.equal(productData.name)
        expect(response.body.data.product.price).to.equal(productData.price)
        expect(response.body.data.product.description).to.equal(productData.description)
    })
})

describe('Teste GraphQL -> Product Update', () => {
    it('Valida update com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: updateProductMutation(1) })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('updateProduct')
        expect(response.body.data.updateProduct).to.equal('Product update successful')
    })
})

describe('Teste GraphQL -> Product Delete', () => {
    it('Valida delete product not found', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: deleteProductMutation(999) })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.errors[0]).to.have.property('message')
        expect(response.body.errors[0].message).to.equal('Product not found')
    })

    it('Valida delete com sucesso', async () => {
        const response = await request(app)
            .post('/api/graphql')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ query: deleteProductMutation(1) })

        expect(response.statusCode).to.equal(StatusCodes.OK)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('deleteProduct')
        expect(response.body.data.deleteProduct).to.equal('Product removed')
    })
})
