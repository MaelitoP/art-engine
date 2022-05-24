var { getFilesFromPath, Web3Storage } =require('web3.storage')
var fs = require('fs');


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY2YkY5RTU3MkIxZTZCMjREQTgxNTI2NUY0RThDM2YzZTk2OEQ3MDYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTIyMDYwNjM2MjUsIm5hbWUiOiJKUlMifQ.ytRSfkm4vNMZn7wpvzDjVQPEPywQ-IJCZ4WvWwM63jc'

function makeStorageClient() {
    return new Web3Storage({ token: token })
}


async function CreateMeta(cid) {
  
    const _client_ = makeStorageClient()
    const _res_ = await _client_.get(cid)
    console.log(`Got a response! [${_res_.status}] ${_res_.statusText}`)
  
    if (!_res_.ok) {
      throw new Error(`failed to get ${cid} - [${_res_.status}] ${_res_.statusText}`)
    }
  
    const allfiles = await _res_.files()
    const final_list = []


    for (const file of allfiles) {

        const vip_meta = {
            "description": "The JRS VIP pass is a collection of 88 very unique NFTs giving advantages to the holder when combined with a JRS Pirate NFT. There will not be more VIPs in the future so if you are among the lucky ones owning one you may want to hold on to it.", 
            "external_url": "https://www.jollyrogersociety.com/", 
            "animation_url": "", 
            "name": "",
            "attributes": [], 
        }
        
    
        const meta = file._name.replace(/\D+/g, '').substring(1).slice(0, -1)

        if(meta.charAt(0) === '0'){
            meta = meta.substring(1);
        }
        
        vip_meta['animation_url'] = `https://ipfs.io/ipfs/${file.cid}`
        vip_meta['name'] = 'JRS VIP ' + meta + "/88"

        const repo = `./extra/json/${meta}`

        fs.writeFileSync(repo, JSON.stringify(vip_meta), function(err) {
          if (err) throw err;
        });
    
        final_list.push(vip_meta)
    
        console.log(`Meta data completed : ${repo}`)
    }
    
    fs.writeFileSync('./extra/json/_metadata.json', JSON.stringify(final_list), function(err) {
        if (err) throw err;
    });

}

CreateMeta(process.argv.slice(2)[0])