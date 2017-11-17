const _ = require('lodash')
const control = require('./controls')

control.methods(['get', 'post', 'put', 'delete'])
//Produtos.updateOptions({new: true, runValidators: true})
//Produtos.after('post', saveProdutos).after('put', saveProdutos)

module.exports = control