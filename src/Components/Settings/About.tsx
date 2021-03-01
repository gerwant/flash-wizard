import React from 'react'
import czarodziej from '../../../assets/czarodziej logo.png'
import electron from 'electron'

const links={
  "davide-fb": "https://www.facebook.com/davide.tedeschi.3",
  "davide-thingiverse": "https://www.thingiverse.com/thing:2867901",
  github: "https://github.com/gerwant/flash-wizard",
  fb: "https://www.facebook.com/GarageMakezone",
  yt: "https://www.youtube.com/channel/UCFXql2ulfybkKO0qT_HHzKQ"
}

const openLink = (link: string) => {
  electron.shell.openExternal(links[link])
}

export default function About() {
  return (
    <div>
      <div className="center"><img src={czarodziej} width="250px"></img></div>
        <div style={{backgroundColor: "#3C404B !important", border: "0px !important"}}>
            <h3 className="version-h3"></h3>
            <h3>Created by Garage Makezone</h3>
            <p>Beautiful Wizard was created by Davide Tedeschi. Thank you very much!</p>
            <i onClick={()=>openLink("davide-fb")} className="pointer large facebook icon" style={{display: "inline"}}></i><i onClick={()=>openLink("davide-thingiverse")} className="pointer large globe icon"></i>
            <h3> <i className="code icon"> </i> with <i className="heart icon" style={{color: "#FF0000"}}></i></h3>
            <i onClick={()=>openLink("github")} className="large pointer icon github"></i>
            <i onClick={()=>openLink("fb")} className="large pointer icon facebook"></i>
            <i onClick={()=>openLink("yt")} className="large pointer icon youtube"></i>
        </div>
    </div>
  )
}
