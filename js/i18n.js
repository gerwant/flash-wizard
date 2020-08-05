const path = require("path")
const electron = require('electron')
const editJsonFile = require("edit-json-file");
const fs = require('fs');
const isDev = require('electron-is-dev');


let configJSON = {
     "Language": "en"
}



let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app
let dirname = isDev ? path.join(__dirname, "../localization") : path.join(process.resourcesPath, "localization")
console.log(dirname)
let configPath = path.join(app.getPath('userData'), "config.json")

fs.access(configPath, fs.F_OK, (err) => {
     if (err) {
          fs.writeFile(configPath, JSON.stringify(configJSON));
     }
     })

let config = editJsonFile(configPath, {autosave: true});




     




function i18n() {
     let language = JSON.parse(fs.readFileSync(configPath, 'utf8'))["Language"]
     try{
          loadedLanguage = JSON.parse(fs.readFileSync(path.join(dirname, language + '.json'), 'utf8'))
     }
     catch{
          loadedLanguage = JSON.parse(fs.readFileSync(path.join(dirname, 'en.json'), 'utf8'))
     }
   
}

i18n.prototype.__ = function(phrase) {
     
    let translation = loadedLanguage[phrase]
    if(translation === undefined || !translation) {
         translation = phrase
    }
    return translation
}

i18n.prototype.changeLanguage = function(l) {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(dirname, l + '.json'), 'utf8'))
    config.set("Language", l)
 }
module.exports = new i18n;