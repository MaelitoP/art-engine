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

async function storeFiles(folder_name, to_save) {

    const files = await getFiles(`./${folder_name}`)
  
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

    if (to_save== 'true') {

        const finaldictio = {}
        const client = makeStorageClient()
        const response = await client.get(cid)

        const allfiles = await response.files()

        for (const file of allfiles) {
            const filename2 = file._name.replace(`/\D+/g`, '')
            const name2 = 'meta' + filename2 

            finaldictio[name2] = `https://${file.cid}.ipfs.dweb.link/`

        }

        finaldictio['cid'] = cid

        fs.writeFileSync(`./build/${folder_name}/cid_info.json`, JSON.stringify(finaldictio), function(err) {
            if (err) throw err;
        });

    }

}


storeFiles(process.argv.slice(2)[0], process.argv.slice(2)[1])



