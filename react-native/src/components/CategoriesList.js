import React, { Component } from 'react'
import { Container, Header, Content, Tab, Tabs } from 'native-base'
import Tab1 from './common/CategoryTab1'
import Tab2 from './common/CategoryTab2'
import Tab3 from './common/CategoryTab3'

class TabsExample extends Component {
  render() {
    return (
      <Container>
        <Header hasTabs />
        <Tabs initialPage={1}>
          <Tab heading="Exercise">
            <Tab1 />
          </Tab>
          <Tab heading="Diet">
            <Tab2 />
          </Tab>
          <Tab heading="Self-Improvement">
            <Tab3 />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default TabsExample