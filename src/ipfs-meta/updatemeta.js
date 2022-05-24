var { getFilesFromPath, Web3Storage } =require('web3.storage')
var fs = require('fs');


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEYzNjQ0OEE0QzZDZWZEOTY0OTFkOTcxOEExMGYwNzJmYTY3NUI5RkEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzgzOTQzMzIzODgsIm5hbWUiOiJUZXN0IEFQSSJ9.C02Cxzo-52tQT62CeJAK0KiH3kpmIh6_vPa5XrF1BhQ'

function makeStorageClient() {
    return new Web3Storage({ token: token })
}

async function UpdateMeta(cid) {
  
  const _client_ = makeStorageClient()
  const _res_ = await _client_.get(cid)
  console.log(`Got a response! [${_res_.status}] ${_res_.statusText}`)

  if (!_res_.ok) {
    throw new Error(`failed to get ${cid} - [${_res_.status}] ${_res_.statusText}`)
  }

  const allfiles = await _res_.files()
  const final_list = []

  for (const file of allfiles) {


    const _res_ = await _client_.get(file.cid)
    const data = await _res_.files()
    console.log(data)


    // const meta = file._name.replace(/\D+/g, '')
    // const repo = `./extra/json/${meta}.json`
    
    // const jsonEx = JSON.parse(fs.readFileSync(repo, 'utf8'));
    // jsonEx['image'] = `https://ipfs.io/ipfs/${file.cid}`

    // fs.writeFileSync(repo, JSON.stringify(jsonEx), function(err) {
    //   if (err) throw err;
    // });

    // final_list.push(jsonEx)

    // console.log(`Meta data completed : ${repo}`)
  }

  
  fs.writeFileSync('./build/json/_metadata.json', JSON.stringify(final_list), function(err) {
    if (err) throw err;
  });

}


UpdateMeta(process.argv.slice(2)[0])