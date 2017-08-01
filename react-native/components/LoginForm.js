import React from 'react';
import {StyleSheet, Image} from 'react-native'
import {Title, Content, Footer, FooterTab, Left, Right, Body, Text, Spinner, Form, Item, Input, Label, Button, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {Head} from './components';

class LoginForm extends Component {
	state = {email: '', password: '', error: '', loading: false, register: true};
	onButtonPress(){
		console.log('pass');
		this.setState({error: '', loading: true});
		if(this.state.register){
			axios.post('http://test.iamdrewt.net/mobileRegister', {
				name: this.state.name
			})
		}
	}
	return(
		<Image source={require('./bgnd2.jpeg')} style={{flex: 1, width: null, height: null, resizeMode: "cover"}}>
          <Head header="Habitual"/>
        
        <Content style={{marginTop: 55}}>
              <Left style={{flex: 1}} />
              <Body style={{flex: 1}}>
                <Text style={{fontSize: 32, fontWeight: '700'}}>
                  Welcome to Habitual
                </Text>
              </Body>
              <Right style={{flex: 1}} />
            
              <Left style={{flex: 1}} />
              <Body style={{flex: 1}}>
                <Text style={{fontSize: 20}}>The Social Habit App</Text>
              </Body>
              <Right style={{flex: 1}} />

              

          <Form style={{marginTop: 55, flex: 1}}>
            <Item style={{flex: 1}}>
              <Label style={{fontWeight: 'bold'}}>Email</Label>
              <Input 
              	placeholder="(Your Amazon account email)"
              	secureTextEntry={false}
              	value={this.state.email}
              	onChangeText={email=>this.setState({email})} 
              	/>
            </Item>
            <Item style={{flex: 1}}floatingLabel last>
              <Label style={{fontWeight: 'bold'}}>Password</Label>
              <Input 
              	placeholder="password"
              	secureTextEntry={true}
              	value={this.state.password}
              	onChangeText={password=>this.setState({password})} 
              	/>
            </Item>
            
            <Left style={{flex: 1}} />
            <Body style={{flex: 1}}>
              <Button style={{marginTop: 30, backgroundColor: "#48A9A6", opacity: 0.8}} iconRight>
                <Text>Log In</Text>
                <Icon name='md-log-in' />
              </Button>
            </Body>
            <Right style={{flex: 1}} />
          
          
          </Form>
          
        </Content>
        </Image>

	)
};

export {LoginForm};