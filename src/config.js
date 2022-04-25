const basePath = process.cwd()
const { MODE } = require(`${basePath}/constants/blend_mode.js`)
const { NETWORK } = require(`${basePath}/constants/network.js`)

// Catch Network type for metadata
const network = NETWORK.eth

// General metadata for Ethereum
const namePrefix = 'JRS'
const description = "Generated JRS Collection of 4848 NFT's"
const baseUri = 'ipfs://'

const layerConfigurations = [
  {
    growEditionSizeTo: 5,
    layersOrder: [
      { name: 'Background' },
      { name: 'Skeleton' },
      { name: 'Teeth' },
      { name: 'Eyes' },
      { name: 'Bandanas' },
      { name: 'EyeCover' },
      { name: 'Cloths' },
      { name: 'Accessories' },
      { name: 'Hats' },
      { name: 'InMouth' },
      { name: 'Beard' },
    ],
  },
]

const shuffleLayerConfigurations = false

const debugLogs = false

const format = {
  width: 4000,
  height: 4000,
  smoothing: false,
}

const text = {
  only: false,
  color: '#ffffff',
  size: 20,
  xGap: 40,
  yGap: 40,
  align: 'left',
  baseline: 'top',
  weight: 'regular',
  family: 'Courier',
  spacer: ' => ',
}

const pixelFormat = {
  ratio: 16 / 9,
}

const background = {
  generate: false,
  brightness: '80%',
  static: true,
  default: '#000000',
}

const extraMetadata = {}

const rarityDelimiter = '#'

const uniqueDnaTorrance = 10000

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: 'preview.png',
}

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
}
