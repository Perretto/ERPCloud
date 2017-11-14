const restful = require('node-restful')
const mongoose = restful.mongoose

const databaseLista = new mongoose.Schema ({
    id: { type: Number, required: true },
    field: { type: String, required: true },
    value: { type: String, required: true },
})

module.exports = restful.model('database', databaseLista)