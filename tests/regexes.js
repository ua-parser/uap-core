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

})

suite('redos', function () {
  var parse = refImpl(regexes).parse

  function timer () {
    var start = Date.now()
    return function () {
      return Date.now() - start
    }
  }

  function testRedos (ua) {
    var time = timer()
    parse(ua)
    var diff = time()
    assert.ok(diff < 300, diff)
  }

  test('should not backtrack aaaa..', function () {
    testRedos(Array(3200).fill('a').join(''))
  })

  test('should not backtrack Smartwatch', function () {
    testRedos('SmartWatch(' + Array(3500).fill(' ').join('') + 'z')
  })

  test('should not backtrack HuaweiA', function () {
    testRedos(';A Build HuaweiA' + Array(3500).fill('4').join('') + 'z')
  })

  test('should not backtrack HbbTV LGE', function () {
    testRedos('HbbTV/0.0.0 (;LGE;' + Array(3500).fill(' ').join('') + 'z')
  })

  test('should not backtrack HbbTV CUS', function () {
    testRedos('HbbTV/0.0.0 (;CUS:;' + Array(3500).fill(' ').join('') + 'z')
  })

  test('should not backtrack HbbTV', function () {
    testRedos('HbbTV/0.0.0 (;' + Array(3500).fill(' ').join('') + 'z')
  })

  test('should not backtrack HbbTV z', function () {
    testRedos('HbbTV/0.0.0 (;z;' + Array(3500).fill(' ').join('') + 'z')
  })
})
