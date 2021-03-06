import React from 'react'
import {Checkbox, List, Grid, Popup, Input, Button} from 'semantic-ui-react'
import strings from '../../localization'

const redeem =
<List.Item>
  <List.Content className="noselect" floated="left">
    <Input
    disabled
      style={{
        width: "335px",
        height: "36px"
      }}
    />
  </List.Content>
  <List.Content >
    <Button disabled className="active-btn redeem-btn" style={{marginLeft: "0px !important"}}>Redeem</Button>
  </List.Content>
</List.Item>


export default function Settings() {
  return (
  <div style={{marginTop: "2%", height: "100%"}}>
    <Grid verticalAlign='middle' columns={4} centered>
      <Grid.Row>
      <List divided style={{width: "90%"}}>
      <List.Item>
        <List.Content floated="left">
          <div className="noselect"  style={{fontWeight: "400", fontSize: "20px", width:"100%"}}>{strings["Redeem Code"]}</div>
        </List.Content>
      </List.Item>
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
