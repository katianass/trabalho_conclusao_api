import jwt from 'jsonwebtoken'
import { ApolloError } from "apollo-server-express"

const graphqlAuthMiddleware = (req) => {
  const jwtToken = process.env.API_JWT_SECRET || 'token-exemplo'
  const authHeader = req.headers['authorization'] || null
  const token = authHeader && authHeader.split(' ')[1]
  // console.log(`(${token})`, '---------------------------\n', `(${req.headers.authorization})`, (!token))
  if (!token) return {}

  try {
    const user = jwt.verify(token.replace("Bearer ", ""), jwtToken)

    return { user } // disponibiliza o user em todos os resolvers
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Token expirado. Faça login novamente.")
    } else if (err.name === "JsonWebTokenError") {
      throw new Error("Token inválido")
    }
    // console.log(err)
    return {}
  }
}

export default graphqlAuthMiddleware
