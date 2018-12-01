import React, { Component } from 'react';
import EmailForm from './Components/Form'
import EmailEditor from './Components/EmailEditor'
import S3FileUpload from './Components/S3FileUpload'
import { Spin, Steps, Card, message } from 'antd';

const API_KEY = 'yV7YBCFQiLaEokjcNYxS3gvuxn0VOQ27SUddlAef'

const DEFAULT_FIELDS = {
    report: {
        value: '',
    },
    result: {
        value: '',
    },
    template: {
        value: '',
    }
}

class Email extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showEditor: false,
            loading: false,
            s3FileKey: null,
            step: 0,
            fields: DEFAULT_FIELDS,
        };
    }

    componentDidMount() {

    }

    emailInputHandler = values => {
        console.log(values)
        const report = values['report'];
        const s3FileKey = values['s3FileKey'];


        this.setState({
            report: report,
            s3FileKey: s3FileKey,
            step: 1
        })
    }


    emailRenderHandler = values => {
        console.log('from Main Render Handler')
        console.log(values)
        const result = values['result'];
        const template = values['template'];

        this.setState({
            loading: true,
            loadingMessage: 'Loading email template with data...',
            result: result,
            template: template,
        })

        const payload = {
            base_template: 'public/email-report-dev/templates/' + template + '.html',
            data: {
                report: this.state.report,
                result: result,
                s3FileKey: this.state.s3FileKey
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
                    html: html,
                    loading: false,
                    step: 2
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
                message.success('Email has been sent out successfully')
                console.log(res)
                this.setState({
                    showEditor: false,
                    loading: false,
                    step: 0,
                    fields: DEFAULT_FIELDS,
                });
            })
            .catch(error => {
                message.error("email sending error")
                this.setState({
                    loading: false
                });
            });;
    }

    backHandler = () => {
        console.log(this.state)
        const step = 0;
        this.setState({
            showEditor: false,
            step: this.state.step>0? this.state.step-1 : 0
        })
    }

    setS3FileKey = (key) => {
        this.setState({
            s3FileKey: key
        })
    }

    handleFormChange = (changedFields) => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    }


    render() {
        const fields = this.state.fields;
        fields.report.value = this.state.report;

        let body = {}
        switch (this.state.step) {
            case 0:
                body = (<S3FileUpload back={this.backHandler} emailRenderHandler={this.emailInputHandler} s3FileKey={this.state.s3FileKey} report={this.state.report}/>)
                break;
            case 1:
                body = (<EmailForm {...fields} onChange={this.handleFormChange} emailRenderHandler={this.emailRenderHandler} back={this.backHandler} />)
                break;
            case 2:
                body = (<EmailEditor html={this.state.html} back={this.backHandler} send={this.sendEmailHandler} />)
                break;
            default:
                body = {}
        }
        //const body = this.state.showEditor ? <EmailEditor html={this.state.html} back={this.backFromEditorHandler} send={this.sendEmailHandler} /> : <EmailForm emailRenderHandler={this.emailRenderHandler} />;
        const Step = Steps.Step;
        return (
            <Card title="Send email for review">
                <div style={{ paddingLeft: '150px', paddingRight: '150px', backgroundColor: '#fff', marginBottom: '40px' }}>
                    <Steps current={this.state.step} >
                        <Step title="Upload Report" />
                        <Step title="Input & Select Template" />
                        <Step title="Review & Send" />
                    </Steps>
                </div>
                <div>
                    {this.state.loading && <Spin size="large" tip={this.state.loadingMessage} />}
                    {!this.state.loading && body}
                </div>

            </Card>
        );
    }
}

export default Email;
