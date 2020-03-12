const app = require('./app')
const http = require('http')
const path = require('path')

const server = http.createServer(app)

server.listen(process.env.PORT || 5000, () => {
	console.log(`Server is running on port ${process.env.PORT}`)
})

app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
		if (err) {
			res.status(500).send(err)
		}
	})
})
