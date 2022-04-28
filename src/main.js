const fs = require('fs')
const sha1 = require(`${basePath}/node_modules/sha1`)
const { createCanvas, loadImage } = require(`${basePath}/node_modules/canvas`)

const buildDir = `${basePath}/build`
const layersDir = `${basePath}/layers`

const basePath = process.cwd()
const {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  defaultGenerationConfig,
  skeletonColorMatching,
  rarityDelimiter,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  namePrefix,
} = require(`${basePath}/src/config.js`)

// Constants
const DNA_DELIMITER = '-'

// Canvas setup
const canvas = createCanvas(format.width, format.height)
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = format.smoothing

// Default attributes
var metadataList = []
var attributesList = []
var dnaList = new Set()

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true })
  }
  fs.mkdirSync(buildDir)
  fs.mkdirSync(`${buildDir}/json`)
  fs.mkdirSync(`${buildDir}/images`)
}

const getRarityWeight = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4)
  var nameWithoutWeight = Number(
    nameWithoutExtension.split(rarityDelimiter).pop(),
  )
  if (isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 1
  }
  return nameWithoutWeight
}

const cleanDna = (_str) => {
  const withoutOptions = removeQueryStrings(_str)
  return Number(withoutOptions.split(':').shift())
}

const cleanName = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4)
  let nameWithoutRarity = nameWithoutExtension.split(rarityDelimiter).shift()
  return nameWithoutRarity
    .split('. ')
    .map((e) => e.charAt(0).toUpperCase() + e.substring(1).toLowerCase())[0]
}

const getColor = (_str) => {
  let name = cleanName(_str)

  for (let i = 0; i < skeletonColorMatching.length; i++) {
    if (skeletonColorMatching[i].name === name)
      return skeletonColorMatching[i].matchingColor
  }

  return false
}

const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      if (i.includes('-')) {
        throw new Error('Layer name can not contain dashes, please fix:', i)
      }
      return {
        id: index,
        name: cleanName(i),
        filename: i,
        path: `${path}${i}`,
        color: getColor(i),
        weight: getRarityWeight(i),
      }
    })
}

const layersSetup = (layersOrder) => {
  return layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    name:
      layerObj.options?.['displayName'] != undefined
        ? layerObj.options?.['displayName']
        : layerObj.name,
    blend:
      layerObj.options?.['blend'] != undefined
        ? layerObj.options?.['blend']
        : 'source-over',
    opacity:
      layerObj.options?.['opacity'] != undefined
        ? layerObj.options?.['opacity']
        : 1,
    bypassDNA:
      layerObj.options?.['bypassDNA'] !== undefined
        ? layerObj.options?.['bypassDNA']
        : false,
  }))
}

const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/images/JRS_${_editionCount}.png`,
    canvas.toBuffer('image/png'),
  )
}

const genColor = () => {
  let hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 100%, ${background.brightness})`
}

const drawBackground = () => {
  ctx.fillStyle = background.static ? background.default : genColor()
  ctx.fillRect(0, 0, format.width, format.height)
}

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now()
  let tempMetadata = {
    name: `${namePrefix} #${_edition}`,
    description: description,
    image: `${baseUri}/${_edition}.png`,
    dna: sha1(_dna),
    edition: _edition,
    date: dateTime,
    ...extraMetadata,
    attributes: attributesList,
  }
  metadataList.push(tempMetadata)
  attributesList = []
}

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement
  attributesList.push({
    name: _element.layer.name,
    value: selectedElement.name,
  })
}

const loadLayerImg = async (_layer) => {
  try {
    return new Promise(async (resolve) => {
      const image = await loadImage(
        `${_layer.selectedElement ? _layer.selectedElement.path : _layer.path}`,
      )
      resolve({ layer: _layer, loadedImage: image })
    })
  } catch (error) {
    console.error('Error loading image for random gen.:', error)
  }
}

const addText = (_sig, x, y, size) => {
  ctx.fillStyle = text.color
  ctx.font = `${text.weight} ${size}pt ${text.family}`
  ctx.textBaseline = text.baseline
  ctx.textAlign = text.align
  ctx.fillText(_sig, x, y)
}

const drawElement = (_renderObject, _index, _layersLen) => {
  ctx.globalAlpha = _renderObject.layer.opacity
  ctx.globalCompositeOperation = _renderObject.layer.blend
  text.only
    ? addText(
        `${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
        text.xGap,
        text.yGap * (_index + 1),
        text.size,
      )
    : ctx.drawImage(
        _renderObject.loadedImage,
        0,
        0,
        format.width,
        format.height,
      )

  addAttributes(_renderObject)
}

const constructLayerToDna = (_dna = '', _layers = []) => {
  return _layers.map((layer, index) => {
    let selectedElement = layer.elements.find(
      (e) => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index]),
    )
    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    }
  })
}

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna) => {
  const dnaItems = _dna.split(DNA_DELIMITER)
  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/
    const querystring = query.exec(element)
    if (!querystring) {
      return true
    }
    const options = querystring[1].split('&').reduce((r, setting) => {
      const keyPairs = setting.split('=')
      return { ...r, [keyPairs[0]]: keyPairs[1] }
    }, [])

    return options.bypassDNA
  })

  return filteredDNA.join(DNA_DELIMITER)
}

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna) => {
  const query = /(\?.*$)/
  return _dna.replace(query, '')
}

const isDnaUnique = (_DnaList = new Set(), _dna = '') => {
  const _filteredDNA = filterDNAOptions(_dna)
  return !_DnaList.has(_filteredDNA)
}

const createDna = (_layers) => {
  var matchingColor = null
  let randNum = []
  _layers.forEach((layer) => {
    var totalWeight = 0
    layer.elements.forEach((element) => {
      if (element.name.includes(matchingColor)) {
        element.weight += 10
      }
      totalWeight += element.weight
    })
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight)
    for (var i = 0; i < layer.elements.length; i++) {
      // subtract the current weight from the random weight until we reach a sub zero value.

      random -= layer.elements[i].weight
      if (random < 0) {
        // Save main layer color
        if (layer.name === 'Skeleton') matchingColor = layer.elements[i].color
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${
            layer.bypassDNA ? '?bypassDNA=true' : ''
          }`,
        )
      }
    }
  })
  return randNum.join(DNA_DELIMITER)
}

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data)
}

const saveMetaDataSingleFile = (_editionCount) => {
  let metadata = metadataList.find((meta) => meta.edition == _editionCount)

  if (debugLogs)
    console.log(
      `Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`,
    )

  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2),
  )
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }
  return array
}

const defaultCreation = async () => {
  let defaultAttributes = [[], [], [], [], [], [], [], [], []]

  defaultGenerationConfig.forEach((item) => {
    // Skeleton
    defaultAttributes[0].push(
      getElements(`${layersDir}/Skeleton/`).filter(
        (dirSkeleton) => dirSkeleton.name === item.attributes[0].value,
      )[0],
    )

    // Teeth
    defaultAttributes[1].push(
      getElements(`${layersDir}/Teeth/`).filter(
        (dirTeeth) => dirTeeth.name === item.attributes[1].value,
      )[0],
    )

    // Eyes
    defaultAttributes[2].push(
      getElements(`${layersDir}/Eyes/`).filter(
        (dirEyes) => dirEyes.name === item.attributes[2].value,
      )[0],
    )

    // Bandanas
    defaultAttributes[3].push(
      getElements(`${layersDir}/Bandanas/`).filter(
        (dirBand) => dirBand.name === item.attributes[3].value,
      )[0],
    )

    // Eye Cover
    defaultAttributes[4].push(
      getElements(`${layersDir}/EyeCover/`).filter(
        (dirEyeCover) => dirEyeCover.name === item.attributes[4].value,
      )[0],
    )

    // Cloths
    defaultAttributes[5].push(
      getElements(`${layersDir}/Cloths/`).filter(
        (dirCloths) => dirCloths.name === item.attributes[5].value,
      )[0],
    )

    // Accessories
    defaultAttributes[6].push(
      getElements(`${layersDir}/Accessories/`).filter(
        (dirAcces) => dirAcces.name === item.attributes[6].value,
      )[0],
    )

    // Hats
    defaultAttributes[7].push(
      getElements(`${layersDir}/Hats/`).filter(
        (dirHats) => dirHats.name === item.attributes[7].value,
      )[0],
    )

    // In Mouth
    defaultAttributes[8].push(
      getElements(`${layersDir}/InMouth/`).filter(
        (dirMouth) => dirMouth.name === item.attributes[8].value,
      )[0],
    )
  })

  let defaultNFT = []
  let count = 0

  while (count != 4) {
    for (
      let attributes = 0;
      attributes < defaultAttributes.length;
      attributes++
    ) {
      const layer = defaultAttributes[attributes][count]
      if (layer)
        defaultNFT.push(loadLayerImg(defaultAttributes[attributes][count]))
    }

    await Promise.all(defaultNFT).then((renderObjectArray) => {
      if (debugLogs) console.log('Clearing canvas')

      ctx.clearRect(0, 0, format.width, format.height)

      renderObjectArray.forEach((renderObject) => {
        ctx.drawImage(
          renderObject.loadedImage,
          0,
          0,
          format.width,
          format.height,
        )
      })

      saveImage(`default_${count}`)
    })

    count++
    defaultNFT = []
  }
}

const genRandomNumberArray = (maxLimit = 4837) => {
  let arr = []
  let itr = 0

  while (itr !== 5) {
    let index = Math.floor(Math.random() * maxLimit)
    if (!arr.includes(index)) {
      arr.push(index)
      itr++
    }
  }
  return arr
}

const startCreating = async () => {
  let layerConfigIndex = 0
  let editionCount = 1
  let failedCount = 0
  let abstractedIndexes = []
  let extraLayerIndex = genRandomNumberArray()
  let extraLayerData = getElements(`${layersDir}/Extra/`)

  for (
    let i = 1;
    i <= layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
    i++
  ) {
    abstractedIndexes.push(i)
  }
  if (shuffleLayerConfigurations) {
    abstractedIndexes = shuffle(abstractedIndexes)
  }

  if (debugLogs) console.log('Editions left to create: ', abstractedIndexes)

  while (layerConfigIndex < layerConfigurations.length) {
    const layers = layersSetup(
      layerConfigurations[layerConfigIndex].layersOrder,
    )
    while (
      editionCount <= layerConfigurations[layerConfigIndex].growEditionSizeTo
    ) {
      let newDna = createDna(layers)
      if (isDnaUnique(dnaList, newDna)) {
        let results = constructLayerToDna(newDna, layers)
        let loadedElements = []

        results.forEach((layer) => {
          loadedElements.push(loadLayerImg(layer))
        })

        let randomNbr = dnaList.length + 1
        if (extraLayerIndex.includes(randomNbr)) {
          let layerIndex = extraLayerIndex.indexOf(randomNbr)
          console.log(extraLayerData[layerIndex])
          loadedElements.push(extraLayerData[layerIndex])
        }

        await Promise.all(loadedElements).then((renderObjectArray) => {
          if (debugLogs) console.log('Clearing canvas')

          ctx.clearRect(0, 0, format.width, format.height)
          if (background.generate) {
            drawBackground()
          }
          renderObjectArray.forEach((renderObject, index) => {
            drawElement(
              renderObject,
              index,
              layerConfigurations[layerConfigIndex].layersOrder.length,
            )
          })

          if (debugLogs)
            console.log('Editions left to create: ', abstractedIndexes)

          saveImage(abstractedIndexes[0])
          addMetadata(newDna, abstractedIndexes[0])
          saveMetaDataSingleFile(abstractedIndexes[0])

          console.log(
            `Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(
              newDna,
            )}`,
          )
        })
        dnaList.add(filterDNAOptions(newDna))
        editionCount++
        abstractedIndexes.shift()
      } else {
        console.log('DNA exists!')
        failedCount++
        if (failedCount >= uniqueDnaTorrance) {
          console.log(
            `You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`,
          )
          process.exit()
        }
      }
    }
    layerConfigIndex++
  }
  writeMetaData(JSON.stringify(metadataList, null, 2))
}

module.exports = {
  defaultCreation,
  startCreating,
  buildSetup,
  getElements,
}
