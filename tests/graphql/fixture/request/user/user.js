const userData = {
    name: "katiana Teste",
    email: "katiana@gmail.com",
    password: "123456",
    phone: "62999990000"
}

const loginMutation = `mutation {
  login(email: "${userData.email}", password: "${userData.password}") {
    message
    token
  }
}`

const createUserMutation = `mutation {
  createUser(name: "${userData.name}", email: "${userData.email}", password: "${userData.password}", phone: "${userData.phone}") 
}`

const updateUserMutation = function(userId) {
    return `mutation {
        updateUser(id: ${userId}, name: "${userData.name}", email: "${userData.email}", password: "${userData.password}", phone: "${userData.phone}") 
    }`
}

const deleteUserMutation = function(userId) {
    return `mutation {
        deleteUser(id: ${userId}) 
    }`
}

const showUserQuery = function(userId) {
    return `query {
        user(id: ${userId}) {
            id
            name
            email
            phone
        }
    }`
}

const listUserQuery = `query {
    users {
        id
        name
        email
        phone
    }
}`

export {
    userData,
    loginMutation,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
    listUserQuery,
    showUserQuery,
    
}