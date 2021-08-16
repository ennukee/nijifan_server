const fs = require('fs')
const path = require('path')

function fetchData() {
  fs.writeFile(path.join(__dirname, '../public/data.json'), JSON.stringify({ hello: Math.random() }), null, (err) => console.log(err))
}

module.exports = {
  fetchData,
}