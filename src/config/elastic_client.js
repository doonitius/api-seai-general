const { Client } = require('@elastic/elasticsearch')

const client = new Client({
	cloud: {
		id: process.env.ELASTIC_ID,
	},
	auth: {
		username: process.env.ELASTIC_USERNAME,
		password: process.env.ELASTIC_PASSWORD,
	},
})

client
	.ping()
	.then((response) => console.log('You are connected to Elasticsearch!'))
	.catch((error) => console.error('Elasticsearch is not connected.'))

module.exports = client
