import React, { Component } from 'react';
import logo from './logo.svg';
import MyEditor from './MyEditor';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import './App.css';

import { Layout, Menu, Icon, Spin } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
class App extends Component {

  constructor(props) {
    super(props);
    const html = " "
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
        showEditor: false,
        collapsed: false,
      };
    }
  }

  componentDidMount() {

  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });

    const text = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    console.log(JSON.stringify({
      body: text
    }));
  };

  emailInputHandler = e => {

    this.setState({
      loading : true,
      loadingMessage : 'Loading email template with data...'
    })
    e.preventDefault();
    const report = e.target.elements.report.value;
    const result = e.target.elements.result.value;
    const s3FileKey = e.target.elements.s3FileKey.value;
    const template = e.target.elements.template.value;
    const payload = {
      base_template: 'reports/email-templates/' + template + '.html',
      report: report,
      result: result,
      s3FileKey: s3FileKey
    }

    fetch('https://u00fm8uvw3.execute-api.us-east-1.amazonaws.com/Test/render', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        const html = res["html"]
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          this.setState({
            editorState,
            showEditor: true,
            report: report,
            s3FileKey: s3FileKey,
            loading : false
          });
        }
        console.log(this.state.s3FileKey)
      })
      .catch(error => {
        alert("template error")
      });

  }
  sendEmailHanlder = () => {
    this.setState({
      loading : true,
      loadingMessage : 'Sending email...'
    })
    const htmlText = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    const payload = {
      "sender": "naingdev@gmail.com",
      "receiver": "naingaye.thet@lucencedx.com",
      "subject": this.state.subject,
      "report": this.state.report,
      "s3FileKey": this.state.s3FileKey,
      "html_body": htmlText
    }

    fetch('https://wqavh73jnl.execute-api.us-east-1.amazonaws.com/test/email', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if(!res.ok)
          alert('Failed to send email')
        else 
          return res.json()
      })
      .then(res => {
        alert('Email has been sent out successfully')
        console.log(res)
        this.setState({
          showEditor: false,
          loading : false
        });
      });

  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    const { editorState } = this.state;
    const emailInput = (
      <div className="ant-card ant-card-bordered" style={{ textAlign: "left" }}>
        <div className="ant-card-head">
          <div class="ant-card-head-title">Create Email</div>
        </div>
        <div className="ant-card-body">
          <form onSubmit={this.emailInputHandler} style={{ paddingLeft: "200px", paddingRight: "200px" }}>
            <div className="form-group row">
              <label for="inputReport" class="col-sm-2 col-form-label">Report</label>
              <div className="col-sm-10">
                <input type="text" name="report" class="form-control" id="inputReport" placeholder="Report name" />
              </div>
            </div>
            <div className="form-group row">
              <label for="inputResult" class="col-sm-2 col-form-label">Result</label>
              <div className="col-sm-10">
                <input type="text" name="result" class="form-control" id="inputResult" placeholder="Result" />
              </div>
            </div>
            <div className="form-group row">
              <label for="inputKey" class="col-sm-2 col-form-label">S3FileKey</label>
              <div className="col-sm-10">
                <input type="text" name="s3FileKey" class="form-control" id="inputKey" placeholder="S3 File Key" />
              </div>
            </div>
            <div className="form-group row">
              <label for="inputTemplate" class="col-sm-2 col-form-label">Template</label>
              <div className="col-sm-10">
                <input type="text" name="template" class="form-control" id="inputTemplate" placeholder="Choose email template" />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <input className="btn btn-primary" type="submit" value="Create Email" />
            </div>
          </form>
        </div>



      </div>
    );

    const emailEditor = (
      <div style={{ padding: '20px' }}>
        <div className="form-group row">
          <label for="subject" className="col-sm-1 col-form-label" style={{ textAlign: 'left' }}>Subject:</label>
          <div className="col-sm-11">
            <input type="text" className="form-control" id="subject" placeholder="Subject" onChange={(e) => this.setState({ subject: e.target.value })} />
          </div>
        </div>

        <div style={{ padding: "20px", border: "1px solid #ccc" }}>

          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
          />
        </div>
        <div style={{ margin: "10px", textAlign: "right" }}>
          <button className="btn btn-primary" onClick={this.sendEmailHanlder} style={{ marginRight: "20px" }}>Send Email</button>
          <button className="btn btn-danger" onClick={() => this.setState({ showEditor: false })}>Back</button>
        </div>

      </div>
    );

    const body = this.state.showEditor ? emailEditor : emailInput;
    return (

      // <div className="App">
      //   <header className="App-header">
      //     Email Demo
      //   </header>
      //   {body}

      // </div>
      <Layout>
        <Sider

          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <h3 style={{ color: 'white', margin: '20px' }}>Email Demo</h3>
            <Menu.Item key="1">
              <Icon type="mail" />
              <span>email</span>
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
            <Content style={{ margin: '24px 16px', background: '#fff' }}>
              {this.state.loading && <Spin size="large" tip={this.state.loadingMessage}/>}
              {!this.state.loading && body}
            </Content>
          </div>

        </Layout>
      </Layout>



    );
  }
}

export default App;
