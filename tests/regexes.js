'use strict'

var assert = require('assert')
var path = require('path')
var fs = require('fs')
var yaml = require('yamlparser')
var regexes = readYAML('../regexes.yaml')
var safe = require('safe-regex')
var refImpl = require('uap-ref-impl')

function readYAML (fileName) {
  var file = path.join(__dirname, fileName)
  var data = fs.readFileSync(file, 'utf8')
  return yaml.eval(data)
}

suite('regexes', function () {
  Object.keys(regexes).forEach(function (parser) {
    suite(parser, function () {
      regexes[parser].forEach(function(item) {
        test(item.regex, function () {
          assert.ok(safe(item.regex))
        })
      })
    })
  })

  Object.keys(regexes).forEach(function (parser) {
    suite(`no reverse lookup in ${parser}`, function () {
      regexes[parser].forEach(function(item) {
        test(item.regex, function () {
          if (/\(\?<[!=]/.test(item.regex)) {
            assert.ok(false, 'go parser does not support regex lookbehind. See https://github.com/google/re2/wiki/Syntax')
          }
          if (/\(\?[!=]/.test(item.regex)) {
            assert.ok(false, 'go parser does not support regex lookahead. See https://github.com/google/re2/wiki/Syntax')
          }
        })
      })
    })
  })

  test('should not backtrack', function () {
    var parse = refImpl(regexes).parse
    var ua = Array(3200).fill('a').join('')
    var start = Date.now()
    parse(ua)
    var diff = Date.now() - start
    assert.ok(diff < 500, diff)
  })
})
