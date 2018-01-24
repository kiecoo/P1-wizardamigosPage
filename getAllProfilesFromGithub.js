// getAllProfilesFromGithub.js
module.exports = getAllProfilesFromGithub

function getAllProfilesFromGithub (callback) {

  var dc = require('dom-console', '5.1.0')()
dc.api.toggle()
var minixhr = require('minixhr')
var bel = require('bel')
var csjs = require('csjs-inject')

var css = csjs`
  body{
    background-color : pink;
    color:black;
}
.card{
   width : 300px;
   height : 300px;
   border : 5px solid white;
}
.front {
    background-color:    lightblue;
    height: 300px;
    animation-name: flip2;
    animation-duration: 5s;
  }
  .back {
      background-color: pink;
      height: 200px;
    animation-name: flip1;
    animation-duration: 1s;
  }
@keyframes flip1 {
    from {height: 300px;}
    to {height: 600px;}
  }
  @keyframes flip2 {
    from {height: 600px;}
    to {height: 300px;}
  }
`





var url = 'https://api.github.com/repos/wizardamigos/profiles/forks'  

minixhr(url, response)

function response (json) {
  var allusers = JSON.parse(json)
  // console.info(allusers) 

  allusers.forEach(function (nameEach) {
    var reponame = nameEach.full_name
    var repoURL = 'https://api.github.com/repos/' + reponame

    minixhr(repoURL, response2)
   })
 }


function response2 (data) {
  var obj = JSON.parse(data)
  var repoFilesAndFoldersURL = obj.branches_url.replace('{/branch}', '/' + obj.default_branch)

  minixhr(repoFilesAndFoldersURL, function (data) {
    var obj = JSON.parse(data)
    var filesAndFoldersURL = obj.commit.commit.tree.url

    minixhr(filesAndFoldersURL, function (data) {
      var obj = JSON.parse(data)
      obj.tree.forEach(function (file) {
        if (file.path === 'config.json') {
          var configJsonURL = file.url
          minixhr(configJsonURL, function (data) {
            var obj = JSON.parse(data)
            var json = atob(obj.content)
            try {
              var profile = JSON.parse(json)            
            } catch (error) {
              profile = {
                name: `ERROR: ${configJsonURL}`
              }
            }

            console.log(profile)

            document.body.appendChild(usercard(profile))
            // document.body.appendChild(usercard(profile))
            // document.body.appendChild(usercard(profile))
          })
        }
      })
    })
  })  
}

function usercard (profile) {

  function usecardA(data){
  var el = bel`
  <div onclick="${flip}" class="${css.card} ${css.front}"> 
      <h1>${data.name}</h1>
      <img scr="smiley.gif" alt="photo" height="200" width="200">
  </div>
`
  function flip (){
    el.classList.toggle(css.front)
    el.classList.toggle(css.back)
  }
  return el
}

  return bel`
  <div > 
      <h1>${usecardA(profile) }</h1>
  </div>

`
}
  
  
  var error = null // or `new Error('something went wrong')
  var allUserProfiles = profile // write code to add all the data
  callback(error, allUserProfiles)
}
