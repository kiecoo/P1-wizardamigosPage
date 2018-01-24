

var dc = require('dom-console', '5.1.0')()
dc.api.toggle()
var minixhr = require('minixhr')
var bel = require('bel')
var csjs = require('csjs-inject')

var url = 'https://api.github.com/repos/wizardamigos/profiles/forks'  

minixhr(url, response)

function response (json) {
  var allusers = JSON.parse(json)
  console.info(allusers) 
  
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
            var profile = JSON.parse(json)
            
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
var css = csjs`
  .main { color: red; }
  .json {
    background-color: grey;
    color: white;
  }
`
function usercard (profile) {
  return bel`
    <div class=${css.main}>
      <h1> ${profile.username} </h1>
      <pre class=${css.json}> ${ JSON.stringify(profile, null, 4) } </pre>
    </div>
  `
}

// // allusers.forEach(function(data)){
//    var name = data.owner.login
//    console.info(name) 
// }

// owner.login
