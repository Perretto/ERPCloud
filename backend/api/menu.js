const restful = require('node-restful')
const mongoose = restful.mongoose

const menusLista = new mongoose.Schema ({
    id: { type: Number, required: true },
    html: { type: String, required: true },
})

module.exports = restful.model('menu', menusLista)