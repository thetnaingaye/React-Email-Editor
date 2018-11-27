import React, { Component } from 'react';
import EmailForm from './Components/Form'
import EmailEditor from './Components/EmailEditor'
import { Spin } from 'antd';

const API_KEY = 'yV7YBCFQiLaEokjcNYxS3gvuxn0VOQ27SUddlAef'

class Email extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showEditor: false,
            loading : false
        };
    }

    componentDidMount() {

    }

    emailRenderHandler = values => {
        console.log('from Main Render Handler')
        console.log(values)

        this.setState({
            loading: true,
            loadingMessage: 'Loading email template with data...'
        })
        const report = values['report'];
        const result = values['result'];
        const s3FileKey = values['s3FileKey'];
        const template = values['template'];

        const payload = {
            base_template: 'reports/email-templates/' + template + '.html',
            data: {
                report: report,
                result: result,
                s3FileKey: s3FileKey
            }
        }

        fetch('https://dqkd81sw98.execute-api.ap-southeast-1.amazonaws.com/test/email/render', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                console.log(res.status)
                if (!res.ok)
                    throw Error(res.status)
                else
                    return res.json()
            })
            .then(res => {
                console.log(res)
                const html = res["html"]
                this.setState({
                    showEditor: true,
                    s3FileKey: s3FileKey,
                    html: html,
                    loading: false
                });
                console.log(this.state.s3FileKey)
            })
            .catch(err => {
                alert('Template Error')
                this.setState({
                    showEditor: false,
                    loading: false
                });
            })

    }

    sendEmailHandler = (values) => {
        console.log('main send handler')
        console.log(values)

        this.setState({
            loading: true,
            loadingMessage: 'Sending email...'
        })

        const payload = {
            data: {
                "sender": "naingdev@gmail.com",
                "receiver": "naingaye.thet@lucencedx.com",
                "subject": values['subject'],
                "s3FileKey": this.state.s3FileKey,
                "html_body": values['html']
            }
        }

        fetch('https://dqkd81sw98.execute-api.ap-southeast-1.amazonaws.com/test/email/send', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok)
                    throw Error(res.status)
                else
                    return res.json()
            })
            .then(res => {
                alert('Email has been sent out successfully')
                console.log(res)
                this.setState({
                    showEditor: false,
                    loading: false
                });
            })
            .catch(error => {
                alert("email sending error")
                this.setState({
                    loading: false
                });
            });;
    }

    backFromEditorHandler = () => {
        this.setState({
            showEditor: false,
        })
    }

    render() {
        const body = this.state.showEditor ? <EmailEditor html={this.state.html} back={this.backFromEditorHandler} send={this.sendEmailHandler} /> : <EmailForm emailRenderHandler={this.emailRenderHandler} />;
        return (
            <div>
                {this.state.loading && <Spin size="large" tip={this.state.loadingMessage} />}
                {!this.state.loading && body}
            </div>
        );
    }
}

export default Email;
