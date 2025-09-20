import { gql } from "apollo-server-express"

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    phone: String!
  }

  type Product {
    id: Int!
    name: String!
    price: String!
    description: String!
  }
  
  type AuthToken {
    message: String!
    token: String!
  }

  type Query {
    users: [User]
    user(id: Int!): User
    products: [Product]
    product(id: Int!): Product
  }

  type Mutation {
    register(name: String!, email: String!, phone: String!, password: String!): String
    login(email: String!, password: String!): AuthToken
    createUser(name: String!, email: String!, phone: String!, password: String!): String
    updateUser(id: Int!, name: String!, email: String!, phone: String!, password: String!): String
    deleteUser(id: Int!): String

    createProduct(name: String!, price: String!, description: String!): String
    updateProduct(id: Int!, name: String!, price: String!, description: String!): String
    deleteProduct(id: Int!): String
  }
`

export default typeDefs
