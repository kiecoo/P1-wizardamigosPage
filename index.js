var UserProfile = require('./userprofile.js')
var getData = require('./getAllProfilesFromGithub.js')
var makeBar = require('./makeSearchAndFilterBar.js')

getData(function (error, data) {
  if (error) return console.log('something went wront', error)
  var element = makeBar(data, UserProfile)
  document.body.appendChild(element)
})
