const userRegisterDataRequest = {
    id: 123,
    name: 'Fake User',
    email: 'faker@gamil.com',
    password: 'teste-senha',
    phone: '6299990000'
}
const userRegisterResponse = {
    message: "User registered successfully!",
    data: userRegisterDataRequest
}

export {
    userRegisterDataRequest,
    userRegisterResponse
}