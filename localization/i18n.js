const path = require("path")
const electron = require('electron')
const editJsonFile = require("edit-json-file");
const fs = require('fs');

let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app
let config = editJsonFile(path.join(__dirname, "config.json"), {autosave: true});


function i18n() {
     let language = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'))["Language"]
     try{
          loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, language + '.json'), 'utf8'))
     }
     catch{
          loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, 'en.json'), 'utf8'))
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
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, l + '.json'), 'utf8'))
    config.set("Language", l)
 }
module.exports = new i18n;