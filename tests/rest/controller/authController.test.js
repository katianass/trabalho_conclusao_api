import { expect, use } from 'chai'
import request from 'supertest'
import sinon from 'sinon'
import { faker } from '@faker-js/faker'
import { StatusCodes } from "http-status-codes"

import { UserService } from "#services/userService.js"
import app from '#app/app.js'
import { userRegisterDataRequest, userRegisterResponse} from './sinon-mock/register.mock.js'

describe('Validando controller com mock no service', () => {
    let userServiceCreateMock;
    let userServiceCreateEmailDuplicateMock;
    
    beforeEach(() => {
        userServiceCreateMock = sinon.
            stub(UserService.prototype, 'create').
            resolves(userRegisterDataRequest)
    })

    afterEach(() => {
        userServiceCreateMock.restore()
    })

    it('Register User sucess (Com Mock)', async () => {
        const response = await request(app)
            .post('/api/rest/auth/register')
            .send(userRegisterDataRequest)

        expect(response.status).to.equal(StatusCodes.CREATED)
        expect(response.body.message).to.equal(userRegisterResponse.message)
        expect(response.body.data.id).to.equal(userRegisterResponse.id)
        expect(response.body.data.name).to.equal(userRegisterResponse.name)
        expect(response.body.data.email).to.equal(userRegisterResponse.email)
        expect(response.body.data.phone).to.equal(userRegisterResponse.phone)
    })

    it('Register User email Duplicate (Com Mock)', async () => {
        userServiceCreateEmailDuplicateMock = sinon.
            stub(UserService.prototype, 'findByEmail').
            resolves(userRegisterResponse.data)

        const response = await request(app)
            .post('/api/rest/auth/register')
            .send(userRegisterDataRequest)

        //console.log(response.body)

        expect(response.status).to.equal(StatusCodes.CONFLICT)
        expect(response.body.error).to.equal("The email already exists")

        userServiceCreateEmailDuplicateMock.restore()
    })
})