import React from 'react'
import {Checkbox, List, Grid, Popup} from 'semantic-ui-react'
import strings from '../../localization'

const redeem =
<List.Item>
  <List.Content className="noselect" floated="left" style={{fontWeight: "400", fontSize: "20px"}}>
    {strings["Redeem Code"]}
  </List.Content>
  <List.Content floated="right">
  <Checkbox toggle disabled/>
  </List.Content>
</List.Item>

export default function Settings() {
  return (
  <div style={{marginTop: "2%", height: "100%"}}>
    <Grid verticalAlign='middle' columns={4} centered>
      <Grid.Row>
      <List divided style={{width: "90%"}}>
        <Popup position="top center" content={strings["We are working on it"]} trigger={redeem}/>

        </List>
      </Grid.Row>
    </Grid>
  </div>
        /* <List divided style={{width: "90%"}}>
          <List.Item>
          <List.Content floated="left">
          {strings["Redeem Code"]}
          </List.Content>
          <List.Content floated="right">
          <Checkbox toggle/>
          </List.Content>
          </List.Item>
        </List> */

  )
}
