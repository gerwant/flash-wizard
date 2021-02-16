import LocalizedStrings from 'react-localization';

const strings = new LocalizedStrings({
    en: {
      mainMenuHeader: "Do you have the .hex file?",
      hexBtn: "I have the .hex file",
      nohexBtn: "I don't have the .hex file"
    },

    pl: {
      mainMenuHeader: "Czy masz plik .hex?",
      hexBtn: "Mam plik .hex",
      nohexBtn: "Nie mam pliku .hex"
    }
});

export default strings;
