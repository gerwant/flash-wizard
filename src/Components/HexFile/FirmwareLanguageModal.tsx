import React, {useEffect, useState} from 'react';
import electron from 'electron';
import { List, Header, Button, Icon, Modal, Segment } from 'semantic-ui-react';
import {language_popup, download_hex, hex_downloaded} from '../../constants';
import strings from '../../localization'
import cn from '../../../assets/flags/china.svg'
import { language } from 'custom-electron-titlebar/lib/common/platform';

interface IStringDict {
  [id: string]: string;
}

const FirmwareLanguageModal = ({onDone}: {onDone: () => void}) => {
  const [languageModalVisible, setModalVisibility] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<IStringDict>({pl: '', en: '', de: '', es: '', fr: '', it: '', pt: '', ru: '', cn: ''});

  useEffect(() => {
      let mounted = true

      electron.ipcRenderer.on(language_popup, (ev, data) => {
        if (mounted) {
            setAvailableLanguages(data);
            setModalVisibility(true);
        }
      })

      electron.ipcRenderer.on(hex_downloaded, (ev, data) => {
        if (mounted){
          setModalVisibility(false);
          onDone();
        }
      });

      return  ()=>{
          mounted = false;
          console.log("Unmounting", mounted)
          electron.ipcRenderer.removeListener(language_popup, () => {})
    }

  }, [])

  const isAvailable = (code: string) => {
    try{
      return availableLanguages[code].length>0
    } catch (e) {
      return false
    }
  }

  const submitFWlanguage = (code: string) => {
      // icp send
      electron.ipcRenderer.send(download_hex, availableLanguages[code]);

  }

  function flag_item(svg_name: string, code: string, enabled: boolean) {
      return (
        <List.Item
          as={enabled?'a':'div'}
          className="item flag-item"
          onClick={enabled?() => submitFWlanguage(code):()=>{}}
        >
          <img
            className={`modal-flag ${code}`}
            style={enabled?{filter: 'none'}:{}}
            src={`../assets/flags/${svg_name}.svg`}
            draggable={false}
            alt={`${svg_name}`}
          />
        </List.Item>
      );
  }

  return (
      <Modal
          onClose={()=>setModalVisibility(false)}
          open={languageModalVisible}
          className='language-modal'
          style={{marginTop: "5%"}}
      >
      <Icon
        inverted
        size="big"
        name="close"
        className="close-modal pointer"
        style={{color: "white"}}
        onClick={()=>setModalVisibility(false)}
      />
      <Modal.Header style={{border: "none"}} className='modal-header'>{strings["Choose the firmware language"]}</Modal.Header>
        <Segment style={{width: "400px"}}>
        <List horizontal className="flag-list">
            {flag_item('united-kingdom', 'en', isAvailable('en'))}
            {flag_item('poland', 'pl', isAvailable('pl'))}
            {flag_item('germany', 'de', isAvailable('de'))}
        </List>
        <List horizontal className="flag-list">
            {flag_item('spain', 'es', isAvailable('es'))}
            {flag_item('france', 'fr', isAvailable('fr'))}
            {flag_item('russia', 'ru', isAvailable('ru'))}
          </List>
          <List horizontal className="flag-list">
            {flag_item('italy', 'it', isAvailable('it'))}
            {flag_item('china', 'cn', isAvailable('cn'))}
            {flag_item('portugal', 'pt', isAvailable('pt'))}
          </List>
        </Segment>
      </Modal>
  )
}

export default FirmwareLanguageModal;
