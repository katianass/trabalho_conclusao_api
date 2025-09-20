import app from './app.js'

const port = process.env.API_PORT || 3000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
    console.log(`REST:     http://localhost:${port}/api/rest`)
    console.log(`GraphQL:  http://localhost:${port}/api/graphql`)
})