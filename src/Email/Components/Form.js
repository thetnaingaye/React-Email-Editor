import { Form, Input, Tooltip, Icon, Button, Card } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item

class EmailForm extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.emailRenderHandler(values)
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <div>
                <Card bordered={false}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                    Report&nbsp;
                                <Tooltip title="Report Name">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            )}
                        >
                            {getFieldDecorator('report', {
                                rules: [{ required: true, message: 'Please input report name', whitespace: true }],
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                    Result&nbsp;
                                <Tooltip title="Report Result">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            )}
                        >
                            {getFieldDecorator('result', {
                                rules: [{ required: true, message: 'Please input report result', whitespace: true }],
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                    Template&nbsp;
                                <Tooltip title="Email Template From S3">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            )}
                        >
                            {getFieldDecorator('template', {
                                rules: [{ required: true, message: 'Please input html template file name', whitespace: true }],
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" style={{ float: 'right' }} >Next</Button>
                            <Button type="default" style={{ float: 'right', marginRight: "20px" }} onClick={this.props.back}  >Cancel</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>

        );
    }
}

export default Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            report: Form.createFormField({
                ...props.report,
                value: props.report.value,
            }),
            result: Form.createFormField({
                ...props.result,
                value: props.result.value,
            }),
            template: Form.createFormField({
                ...props.template,
                value: props.template.value,
            })
        };
    },
    onValuesChange(_, values) {
        console.log(values);
    },
}

)(EmailForm)