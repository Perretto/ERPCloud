const restful = require('node-restful')
const mongoose = restful.mongoose

const controlsLista = new mongoose.Schema ({
    controlID: { type: String, required: true },
    autocompleteChange: { type: String, required: false },
})

module.exports = restful.model('controls', controlsLista)