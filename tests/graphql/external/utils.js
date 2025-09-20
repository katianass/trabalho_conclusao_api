import request from 'supertest'
import app from '#app/app.js'

import { registerMutation, loginMutation } from './../fixture/request/auth/register.js'

async function getTokenUser() {
    // Cria um user para autenticar
    await request(app)
        .post('/api/graphql')
        .send({ query: registerMutation })

    // Autentica com o user criado anteriormente
    const response = await request(app)
        .post('/api/graphql')
        .send({ query: loginMutation })

    return response.body.data.login.token
}

export {
    getTokenUser
}