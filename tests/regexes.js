'use strict'

var assert = require('assert')
var path = require('path')
var fs = require('fs')
var yaml = require('yamlparser')
var regexes = readYAML('../regexes.yaml')
var safe = require('safe-regex')

function readYAML (fileName) {
  var file = path.join(__dirname, fileName)
  var data = fs.readFileSync(file, 'utf8')
  return yaml.eval(data)
}

describe('regexes', function () {
  Object.keys(regexes).forEach(function (parser) {
    describe(parser, function () {
      regexes[parser].forEach(function(item) {
        it(item.regex, function () {
        // console.log(item.regex)
          assert.ok(safe(item.regex))
        })
      })
    })
  })
})
