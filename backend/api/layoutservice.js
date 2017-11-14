const _ = require('lodash')
const layout = require('./layouts')

layout.methods(['get', 'post', 'put', 'delete'])
//Produtos.updateOptions({new: true, runValidators: true})
//Produtos.after('post', saveProdutos).after('put', saveProdutos)

module.exports = layout