import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import Email from './Email/Email'

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
          <div style={{textAlign:'center',verticalAlign:'center'}}>
          <h3  style={{color:'white'}}>Email Demo</h3>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {/* <h3 style={{ color: 'white', margin: '20px' }}>Email Demo</h3> */}
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
            <Content style={{ margin: '24px 16px'}}>
              <Email />
            </Content>
          </div>
        </Layout>
      </Layout>
    );
  }
}

export default App;
