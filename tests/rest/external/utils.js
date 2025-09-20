import request from 'supertest'
import { faker } from '@faker-js/faker'
import app from '#app/app.js'

async function getTokenUser() {
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

    // Autentica com o user criado anteriormente
    const respLogin = await request(app)
        .post('/api/rest/auth/login')
        .send({
            email: userLogin.email,
            password: userLogin.password
        })

    return respLogin.body.token
}

export {
    getTokenUser
}