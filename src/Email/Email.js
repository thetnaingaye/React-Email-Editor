import React, { Component } from 'react';
import EmailForm from './Components/Form'
import EmailEditor from './Components/EmailEditor'
import S3FileUpload from './Components/S3FileUpload'
import { Spin, Steps, Card, message } from 'antd';

const API_KEY = 'yV7YBCFQiLaEokjcNYxS3gvuxn0VOQ27SUddlAef'

const DEFAULT_FIELDS = {
    ldx_id: {
        value: '',
    },
    type: {
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
        const ldx_id = values['ldx_id'];
        const type = values['type'];
        // const report = values['report'];
        const result = values['result'];
        const template = values['template']
        // const s3FileKey = values['s3FileKey'];

        this.setState({
            // report: report,
            ldx_id : ldx_id,
            type : type,
            result: result,
            template: template,
            step: 1
        })

        // this.setState({
        //     report: report,
        //     s3FileKey: s3FileKey,
        //     step: 1
        // })
    }


    emailRenderHandler = values => {
        console.log('from Main Render Handler')
        console.log(values)
        const s3FileKey = values['s3FileKey'];
        const report = values['report'];

        this.setState({
            loading: true,
            loadingMessage: 'Loading email template with data...',
            s3FileKey: s3FileKey,
            report : report
        })
        // const result = values['result'];
        // const template = values['template'];

        // this.setState({
        //     loading: true,
        //     loadingMessage: 'Loading email template with data...',
        //     result: result,
        //     template: template,
        // })

        const payload = {
            base_template: 'public/email-report-dev/templates/' + this.state.template + '.html',
            data: {
                report: report,
                result: this.state.result,
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
                    s3FileKey: null,
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
            step: this.state.step > 0 ? this.state.step - 1 : 0
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

    upDatePropsFromS3FileUpload = (values) => {
        this.setState({
            s3FileKey: values['s3FileKey'],
            report : values ['report']
        })
    }

    render() {
        const fields = this.state.fields;
        // fields.report.value = this.state.report;

        let body = {}
        switch (this.state.step) {
            case 0:
                body = (<EmailForm {...fields} onChange={this.handleFormChange} emailRenderHandler={this.emailInputHandler} back={this.backHandler} />)
                break;
            case 1:
                body = (<S3FileUpload back={this.backHandler} emailRenderHandler={this.emailRenderHandler} s3FileKey={this.state.s3FileKey} ldx_id={this.state.ldx_id} type={this.state.type} report={this.state.report} updateProps={this.upDatePropsFromS3FileUpload} />)
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
                        <Step title="General" />
                        <Step title="Upload Report" />
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
