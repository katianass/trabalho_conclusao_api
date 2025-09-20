const registerData = {
    name: "katiana Teste",
    email: "katiana@gmail.com",
    password: "123456",
    phone: "62999990000"
}

const registerMutation = `
mutation {
  register(name: "${registerData.name}", email: "${registerData.email}", password: "${registerData.password}", phone: "${registerData.phone}") 
}
`

const loginMutation = `
mutation {
  login(email: "${registerData.email}", password: "${registerData.password}") {
    message
    token
  }
}
`

export {
    registerData,
    registerMutation,
    loginMutation
}