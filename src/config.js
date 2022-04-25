const basePath = process.cwd()
const { MODE } = require(`${basePath}/constants/blend_mode.js`)
const { NETWORK } = require(`${basePath}/constants/network.js`)

const network = NETWORK.eth

// General metadata for Ethereum
const namePrefix = 'Your Collection'
const description = 'Remember to replace this description'
const baseUri = 'ipfs://NewUriToReplace'

const solanaMetadata = {
  symbol: 'YC',
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: 'https://www.youtube.com/c/hashlipsnft',
  creators: [
    {
      address: '7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC',
      share: 100,
    },
  ],
}

const layerConfigurations = [
  {
    growEditionSizeTo: 10,
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

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
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

const preview_gif = {
  numberOfImages: 5,
  order: 'ASC', // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: 'preview.gif',
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
  solanaMetadata,
  gif,
  preview_gif,
}
