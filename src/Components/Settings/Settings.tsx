import React from 'react'
import {Checkbox, List, Grid, Popup, Input, Button} from 'semantic-ui-react'
import strings from '../../localization'



export default function Settings() {
  const getRedeem = () => {
    const redeem =
    <List.Item>
      <List.Content className="noselect" floated="left">
        <Input
        disabled
          style={{
            width: "325px",
            height: "36px"
          }}
        />
      </List.Content>
      <List.Content >
        <Button disabled className="active-btn redeem-btn" style={{marginLeft: "0px !important", width: "100px", paddingLeft: "0", paddingRight: "0"}}>
          <div>
            {strings.Redeem}
          </div>
        </Button>
      </List.Content>
    </List.Item>
    return redeem
  }
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
        <Popup position="top center" content={strings["We are working on it"]} trigger={getRedeem()}/>
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
