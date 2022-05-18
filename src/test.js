var { getFilesFromPath, Web3Storage } =require('web3.storage')
var fs = require('fs');
var axios = require('axios')
var data = require('../extra/json/cid_info.json')

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }


async function UpdateMeta() {


    for (const file in data) {
        console.log(data[file])
        
        const res = await axios.get(data[file]);
        const newdata = res.data

        const new_name = file.replace(/\D+/g, '')

        newdata['name'] = newdata['name'].replace(' / ', '/')
        newdata['name'] = newdata['name'].replace(' PASS', '')
        newdata['description'] = "Very Important Pirate"
        const repo = `./extra/jsonnew/${new_name}`

        fs.writeFileSync(repo, JSON.stringify(newdata), function(err) {
            if (err) throw err;
        });

        await sleep(2000)

    }

}


UpdateMeta()