const fs = require('fs')
const pathlib = require('path')

function toWhitespace (str) {
  if (str == null || str === '') return ''
  const buf = Buffer.from(str)
  const bytes = new Array(buf.length)
  for (let i = 0; i < buf.length; i++) bytes[i] = buf[i]
  return ' \t' + bytes
    .map(i => i.toString(2).padStart(8, '0')).join('')
    .replace(/0/g, ' ').replace(/1/g, '\t')
    .replace(/.{9}/g, '$&\n') + '\n'
}

function fromWhitespace (str) {
  if (str == null || str === '') return ''
  const bytes = str
    .replace(/^ \t/, '')
    .replace(/[^ \t]/g, '')
    .replace(/\t/g, '1').replace(/ /g, '0')
    .match(/.{8}/g)
    .map(b => parseInt(b, 2))
  return Buffer.from(bytes).toString()
}

const script = fs.readFileSync(module.parent.filename, 'utf8')
const [, before, after] = script.match(/([^]*^require\(['"]acme-bleach['"]\);?\n)([^]*)/m)

if (/^ \t/.test(after) && !(/\S/.test(after))) {
  eval(fromWhitespace(after))
} else {
  fs.writeFileSync(module.parent.filename, before + toWhitespace(after), 'utf8')
}
