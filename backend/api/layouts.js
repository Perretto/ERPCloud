const restful = require('node-restful')
const mongoose = restful.mongoose

const layoutsLista = new mongoose.Schema ({
    id: { type: Number, required: true },
    layoutID: { type: String, required: true },
    html: { type: String, required: true },
    tabgenid: { type: String, required: true },
    listall: { type: String, required: true },
    finddata: { type: String, required: true },
})

module.exports = restful.model('layouts', layoutsLista)