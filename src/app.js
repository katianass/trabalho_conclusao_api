import cors from 'cors'
import fs from 'node:fs'
import express  from "express"
import { ApolloServer } from "apollo-server-express"

import swaggerUi from 'swagger-ui-express'

import { RestRoute } from "#routes/restRoute.js"
import { GraphQLRoute } from "#routes/graphqlRoute.js"

import { UserModel } from "#models/userModel.js"
import { ProductModel } from "#models/productModel.js"

import { UserService } from "#services/userService.js"
import { ProductService } from "#services/productService.js"

import { RestUserController } from "#controllers/rest/userController.js"
import { GraphQLUserController } from "#controllers/graphql/userController.js"

import { RestAuthController } from "#controllers/rest/authController.js"
import { GraphQLAuthController } from "#controllers/graphql/authController.js"

import { RestProductController } from "#controllers/rest/productController.js"
import { GraphQLProductController } from "#controllers/graphql/productController.js"

import typeDefs from "#controllers/graphql/schema.js"

import graphqlAuthMiddleware from '#middlewares/graphqlAuthMiddleware.js'

const app = express()
const router = express.Router()
app.use(cors())
app.use(express.json())

// middleware de erro específico para JSON inválido
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: "JSON mal formatado ou vazio",
      message: err.message
    })
  }
  next(err)
})

const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL('./swagger.json', import.meta.url))
)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// instanciar e inicializa as rotas Rest e GraphQL
// Route Rest
const userModel = new UserModel()
const userService = new UserService(userModel)

const productModel = new ProductModel()
const productService = new ProductService(productModel)

const restAutController = new RestAuthController(userService)
const restUserController = new RestUserController(userService)
const restProductController = new RestProductController(productService)

const routeRest = new RestRoute(
  restAutController,
  restUserController,
  restProductController,
  router
)

// Route GraphQL
const graphQLAutController = new GraphQLAuthController(userService)
const graphQLUserController = new GraphQLUserController(userService)
const graphQLProductController = new GraphQLProductController(productService)

const routeGraphQL = new GraphQLRoute(
  graphQLAutController,
  graphQLUserController,
  graphQLProductController
)

// inicializa api rest
app.use("/api", routeRest.startRoute())

// Rotas GraphQL
//const startServer = async () => {
  const apolloServer = new ApolloServer({ 
    typeDefs,
    resolvers: routeGraphQL.resolvers,
    context: ({ req }) => graphqlAuthMiddleware(req),
    formatError: (err) => {
      // console.log(err)
      return {
        message: err.message,
        code: err.extensions?.code || "INTERNAL_SERVER_ERROR",
        path: err.path,
      }
    },
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    path: "/api/graphql",
  })


//}

//startServer()

export default app