var { getFilesFromPath, Web3Storage } =require('web3.storage')
var fs = require('fs');


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEYzNjQ0OEE0QzZDZWZEOTY0OTFkOTcxOEExMGYwNzJmYTY3NUI5RkEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzgzOTQzMzIzODgsIm5hbWUiOiJUZXN0IEFQSSJ9.C02Cxzo-52tQT62CeJAK0KiH3kpmIh6_vPa5XrF1BhQ'

function makeStorageClient() {
    return new Web3Storage({ token: token })
}

async function getFiles(path) {
    const files = await getFilesFromPath(path)
    console.log(`read ${files.length} file(s) from ${path}`)
    return files
}

async function storeNFTsFiles(folder_name) {

    const files = await getFiles(`./build/${folder_name}`)
  
    // show the root cid as soon as it's ready
    const onRootCidReady = cid => {
        console.log('uploading files with cid:', cid)
    }
  
    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    let uploaded = 0
  
    const onStoredChunk = size => {
        uploaded += size
        const pct = totalSize / uploaded
        console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    }
  
    const client = makeStorageClient()
    const cid = await client.put(files, { onRootCidReady, onStoredChunk })
    console.log('stored files with cid:', cid)
  
    return cid
}

const _cid_ = storeNFTsFiles('images')


async function fileURI(cid_, save) {
  
    const _client_ = makeStorageClient()
    const _res_ = await _client_.get(cid_)
    console.log(`Got a response! [${_res_.status}] ${_res_.statusText}`)
  
    if (!_res_.ok) {
      throw new Error(`failed to get ${cid_} - [${_res_.status}] ${_res_.statusText}`)
    }
  
    // unpack File objects from the response
    const allfiles = await _res_.files()
  
    for (const file of allfiles) {
      if(!save){
        console.log(`${file.cid} -- ${file._name} -- ${file.size}`)
      } else {
        const imagefile = file._name.replace(`${collection}/`, '')
        const jsonfile = imagefile.replace('.png', '')
        const repoDrop = `./build/json-final/${jsonfile}.json`
        
        const jsonEx = JSON.parse(fs.readFileSync(repoDrop, 'utf8'));
        jsonEx['image'] = `https://ipfs.io/ipfs/${file.cid}?filename=${imagefile}`
  
        console.log(`Meata data completed : ${jsonfile}`)
  
        fs.writeFileSync(repoDrop, JSON.stringify(jsonEx), function(err) {
          if (err) throw err;
        });
      }
    }
  
    const _cid2_ = await storeFiles(collection, 'metadata')
    
    const finaldictio = {}
    const client = makeStorageClient()
    const res2 = await client.get(_cid2_)
  
    const allfiles2 = await res2.files()
  
    for (const file2 of allfiles2) {
      const filename2 = file2._name.replace(`${collection}/`, '')
      const name2 = filename2.replace('.json', '')
  
      finaldictio[name2] = `https://ipfs.io/ipfs/${file2.cid}?filename=${filename2}`
  
    }
  
    finaldictio['cid'] = _cid2_
  
    const finalRepo = `./market/nft/${collection}.json`
  
    fs.writeFileSync(finalRepo, JSON.stringify(finaldictio), function(err) {
      if (err) throw err;
    });
  
  }
  

