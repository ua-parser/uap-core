'use strict'

var path = require('path')
var fs = require('fs')
var yaml = require('yamlparser')
var refImpl = require('uap-ref-impl')(readYAML('../regexes.yaml'))

function readYAML (fileName) {
  var file = path.join(__dirname, fileName)
  var data = fs.readFileSync(file, 'utf8')
  return yaml.eval(data)
}

if (require.main === module) {
  var user_agent_string = process.argv[2]
  console.log(refImpl.parse(user_agent_string))
}
