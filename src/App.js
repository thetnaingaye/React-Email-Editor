import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import Email from './Email/Email'
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: 'ap-southeast-1:ede7a7b2-8023-43a6-b87e-c8c6e1a3fcf2',
    // REQUIRED - Amazon Cognito Region
    region: 'ap-southeast-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ap-southeast-1_8sQ4rPwJe',
    // OPTIONAL - Amazon Cognito Web Client ID
    userPoolWebClientId: '34nred8unbrpigci3vkmn2nkhb',
  },
  Storage: {
    bucket: 'bpcc-report', //REQUIRED -  Amazon S3 bucket
    region: 'ap-southeast-1'//OPTIONAL -  Amazon service region
  }
});

const { Header, Content, Sider } = Layout;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div style={{ textAlign: 'center', verticalAlign: 'center' }}>
            <h3 style={{ color: 'white' }}>Email Demo</h3>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="mail" />
              <span className="nav-text">email</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <div style={{ minHeight: '100vh' }}>
            <Content style={{ margin: '24px 16px' }}>
              <Email />
            </Content>
          </div>
        </Layout>
      </Layout>
    );
  }
}

// export default App;
export default withAuthenticator(App, false);

