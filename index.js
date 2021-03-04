const fs = require('fs-extra')
const axios = require('axios').default

axios.defaults.baseURL = 'http://client-jars.badlion.net/common-assets/PRODUCTION'
axios.defaults.headers = {
    'User-Agent': 'Badlion Fetcher/1.0'
}

let totalFiles
let currentFile = 0

axios.get('/v2.17.2-8362da1-PRODUCTION-assets.json')
    .then(body => body.data)
    .then(async data => {
        totalFiles = Object.keys(data).length
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                await downloadFile(key, data[key].name)
            }
        }
        console.log('Done!')
    })
    .catch(console.err)

async function downloadFile(key, hash) {
    return axios.get('/assets/' + hash)
        .then(body => body.data)
        .then(data => {
            console.log('(%s/%s) Downloading %s [%s]', ++currentFile, totalFiles, key, hash)
            fs.outputFile('out/' + key, data, err => {
                if (err) throw err
            })
        })
        .catch(console.err)
}