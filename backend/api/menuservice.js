const _ = require('lodash')
const menu = require('./menu')

menu.methods(['get', 'post', 'put', 'delete'])
//Produtos.updateOptions({new: true, runValidators: true})
//Produtos.after('post', saveProdutos).after('put', saveProdutos)

module.exports = menu