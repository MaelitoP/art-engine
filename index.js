const basePath = process.cwd()
const {
  defaultCreation,
  startCreating,
  buildSetup,
} = require(`${basePath}/src/main.js`)

;(() => {
  buildSetup()
  //defaultCreation()
  startCreating()
})()
