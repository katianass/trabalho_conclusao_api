function requireAuth(resolver) {
  return (parent, args, context, info) => {
    // console.log(parent, args, context, info)
    if (!context.user) {
      throw new Error("Not authenticated")
    }
    return resolver(parent, args, context, info)
  }
}

class GraphQLRoute {
    authController = null
    userController = null
    productController = null

    constructor(authController, userController, productController) {
        this.authController = authController
        this.userController = userController
        this.productController = productController
    }

    resolvers = {
        Query: {
            users: requireAuth(() => {
                return this.userController.findAll()
            }),
            user: requireAuth((_, { id }) => {
                return this.userController.find(id)
            }),
            products: requireAuth(() => {
                return this.productController.findAll()
            }),
            product: requireAuth((_, { id }) => {
                return this.productController.find(id)
            }),
        },
        Mutation: {
            register: (_, { name, email, password, phone }) => {
                return this.authController.register({ name, email, password, phone })
            },
            login: (_, { email, password }) => {
                return this.authController.login({ email, password })
            },
            createUser: requireAuth((_, { name, email, password, phone }) => {
                return this.userController.create({ name, email, password, phone })
            }),
            updateUser: requireAuth((_, { id, name, email, password, phone }) => {
                return this.userController.update({id, name, email, password, phone })
            }),
            deleteUser: requireAuth((_, { id }) => {
                return this.userController.delete(id)
            }),

            // Product
            createProduct: requireAuth((_, { name, price, description }) => {
                return this.productController.create({ name, price, description })
            }),
            updateProduct: requireAuth((_, { id, name, price, description }) => {
                return this.productController.update({id, name, price, description })
            }),
            deleteProduct: requireAuth((_, { id }) =>{
                return this.productController.delete(id)
            }),
        },
    }
}

export {
    GraphQLRoute
}
