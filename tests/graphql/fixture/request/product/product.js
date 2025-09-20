const productData = {
    name: "Produto Teste 1",
    price: "katiana@gmail.com",
    description: "123456"
}

const createProductMutation = `mutation {
  createProduct(name: "${productData.name}", price: "${productData.price}", description: "${productData.description}") 
}`

const updateProductMutation = function(productId) {
    return `mutation {
        updateProduct(id: ${productId}, name: "${productData.name}", price: "${productData.price}", description: "${productData.description}") 
    }`
}

const deleteProductMutation = function(productId) {
    return `mutation {
        deleteProduct(id: ${productId}) 
    }`
}

const showProductQuery = function(productId) {
    return `query {
        product(id: ${productId}) {
            id
            name
            price
            description
        }
    }`
}

const listProductQuery = `query {
    products {
        id
        name
        price
        description
    }
}`

export {
    productData,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
    listProductQuery,
    showProductQuery,
}