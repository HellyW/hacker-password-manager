const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

const schemaFileRegx = new RegExp(/^(\w*)\.js$/)
const schemaPath = "./schemas/"

let model = {}

const schemaFiles = fs.readdirSync(path.join(__dirname, schemaPath), 'utf-8')

schemaFiles.forEach(filename => {
  if(!schemaFileRegx.test(filename)) return
  const key = filename.replace(schemaFileRegx, "$1")
  model[key.toUpperCase()] = mongoose.model(key.toLowerCase(), require(path.join(__dirname, schemaPath, filename)))
})

module.exports = model