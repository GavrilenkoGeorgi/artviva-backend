const app = require('./app')
const http = require('http')

const server = http.createServer(app)

server.listen(process.env.PORT || 5000, () => {
	console.log(`Server is running on port ${process.env.PORT}`)
})
