import restAuthMiddleware from "#middlewares/restAuthMiddleware.js"

class RestRoute {
  authController = null
  userController = null
  productController = null
  routeMain = null

  constructor(authController, userController, productController, routeMain) {
    this.authController = authController
    this.userController = userController
    this.productController = productController
    this.routeMain = routeMain
  }

  startRoute() {
    // Route Auth
    this.routeMain.post("/rest/auth/register", this.authController.validateRegister, (req, res) => {
      this.authController.register(req, res)
    })

    this.routeMain.post("/rest/auth/login", this.authController.validateLogin, (req, res) => {
      this.authController.login(req, res)
    })

    // Route User
    this.routeMain.get("/rest/users", restAuthMiddleware, (req, res) => {
      this.userController.list(req, res)
    })

    this.routeMain.post("/rest/users", restAuthMiddleware, this.userController.validateCreate, (req, res) => {
      this.userController.create(req, res)
    })

    this.routeMain.get("/rest/users/:id", restAuthMiddleware, (req, res) => {
      this.userController.find(req, res)
    })

    this.routeMain.put("/rest/users/:id", restAuthMiddleware, this.userController.validateCreate, (req, res) => {
      this.userController.update(req, res)
    })

    this.routeMain.delete("/rest/users/:id", restAuthMiddleware, (req, res) => {
      this.userController.delete(req, res)
    })

    // Route Products
    this.routeMain.get("/rest/products", restAuthMiddleware, (req, res) => {
      this.productController.list(req, res)
    })

    this.routeMain.post("/rest/products", restAuthMiddleware, this.productController.validateCreate, (req, res) => {
      this.productController.create(req, res)
    })

    this.routeMain.get("/rest/products/:id", restAuthMiddleware, (req, res) => {
      this.productController.find(req, res)
    })

    this.routeMain.put("/rest/products/:id", restAuthMiddleware, this.productController.validateCreate, (req, res) => {
      this.productController.update(req, res)
    })

    this.routeMain.delete("/rest/products/:id", restAuthMiddleware, (req, res) => {
      this.productController.delete(req, res)
    })

    return this.routeMain
  }
}

export {
  RestRoute
}