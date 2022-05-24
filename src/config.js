const basePath = process.cwd()
const { NETWORK } = require(`${basePath}/constants/network.js`)

// Catch Network type for metadata
const network = NETWORK.eth

// General metadata for Ethereum
const namePrefix = 'JRS'
const description = "Generated JRS Collection of 4848 NFT's"
const baseUri = 'ipfs://'

/**
 * Layer configuration.
 *  - Set random generation size
 *  - Layers order
 *
 *  TODO: Create 4836 Gen
 */
const layerConfigurations = [
  {
    growEditionSizeTo: 4848,
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

/**
 * Set matching color with
 * first layer generation
 */
const skeletonColorMatching = [
  {
    name: 'Moss',
    matchingColor: 'green',
  },
  {
    name: 'Camo',
    matchingColor: 'green',
  },
  {
    name: 'Peeling paint',
    matchingColor: 'gold',
  },
  {
    name: 'Splatters',
    matchingColor: 'red',
  },
  {
    name: 'Zombie',
    matchingColor: 'red',
  },
  {
    name: 'Lava',
    matchingColor: 'orange',
  },
  {
    name: 'Gold',
    matchingColor: 'gold',
  },
]

/**
 * Setup default generation by
 * set up fix NFT with attributes
 */
const defaultGenerationConfig = [
  {
    name: 'MAIN',
    attributes: [
      {
        name: 'Skeleton',
        value: 'Bones',
      },
      {
        name: 'Teeth',
        value: 'White gold tooth',
      },
      {
        name: 'Eyes',
        value: 'Base blue',
      },
      {
        name: 'Bandanas',
        value: 'Black fabric',
      },
      {
        name: 'EyeCover',
        value: 'Patch 3 gold',
      },
      {
        name: 'Cloths',
        value: 'Jacket 1 leather dirty jrs gold',
      },
      {
        name: 'Accessories',
        value: 'Gun beige rusted',
      },
      {
        name: 'Hats',
        value: 'Pirate 1 black jrs',
      },
      {
        name: 'InMouth',
        value: 'Cigar',
      },
    ],
  },
  {
    name: 'JACKY',
    attributes: [
      {
        name: 'Skeleton',
        value: 'Burned',
      },
      {
        name: 'Teeth',
        value: 'White red tooth',
      },
      {
        name: 'Eyes',
        value: 'Snake red',
      },
      {
        name: 'Bandanas',
        value: null,
      },
      {
        name: 'EyeCover',
        value: 'Glasses gold',
      },
      {
        name: 'Cloths',
        value: 'Jacket 2 fabric black red jrs shirt grey',
      },
      {
        name: 'Accessories',
        value: 'Katana gold red',
      },
      {
        name: 'Hats',
        value: 'Samurai black red',
      },
      {
        name: 'InMouth',
        value: null,
      },
    ],
  },
  {
    name: 'BRITISH',
    attributes: [
      {
        name: 'Skeleton',
        value: 'Oil stains',
      },
      {
        name: 'Teeth',
        value: 'White',
      },
      {
        name: 'Eyes',
        value: 'Diamonds blue',
      },
      {
        name: 'Bandanas',
        value: 'Purple fabric',
      },
      {
        name: 'EyeCover',
        value: 'Patch 1 black blue gems',
      },
      {
        name: 'Cloths',
        value: 'Jacket 1 fabric blue',
      },
      {
        name: 'Accessories',
        value: 'Dagger gold jrs',
      },
      {
        name: 'Hats',
        value: 'Privateer fabric navy gold jrs hair',
      },
      {
        name: 'InMouth',
        value: 'Cigario',
      },
    ],
  },
  {
    name: 'VIKING',
    attributes: [
      {
        name: 'Skeleton',
        value: 'Rock 2',
      },
      {
        name: 'Teeth',
        value: 'Cracked 1',
      },
      {
        name: 'Eyes',
        value: 'Base brown',
      },
      {
        name: 'Bandanas',
        value: null,
      },
      {
        name: 'EyeCover',
        value: 'Patch 1 brown',
      },
      {
        name: 'Cloths',
        value: 'Shirt fur',
      },
      {
        name: 'Accessories',
        value: 'Dagger rusted',
      },
      {
        name: 'Hats',
        value: 'Viking rusted',
      },
      {
        name: 'InMouth',
        value: 'Cigarette',
      },
    ],
  },
]

// Randomize layers order
const shuffleLayerConfigurations = false

// Print debug message
const debugLogs = false

/**
 * Output dimension
 */
const format = {
  width: 4000,
  height: 4000,
  smoothing: false,
}

/**
 * 4K Resolution format
 */
const pixelFormat = {
  ratio: 16 / 9,
}

// Generate random background or not
const background = {
  generate: false,
  brightness: '80%',
  static: true,
  default: '#000000',
}

const extraMetadata = {}

// String delimiter to set rarity %
const rarityDelimiter = '#'

const uniqueDnaTorrance = 10000

/**
 * Settings for preview command
 * @see preview.js file
 */
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
  defaultGenerationConfig,
  skeletonColorMatching,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  namePrefix,
  network,
}
