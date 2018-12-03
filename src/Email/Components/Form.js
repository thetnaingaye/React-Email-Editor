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
                                    Lucence ID&nbsp;
                                <Tooltip title="Lucence ID">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            )}
                        >
                            {getFieldDecorator('ldx_id', {
                                rules: [{ required: true, message: 'Please input Lucence ID', whitespace: true }],
                            })(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                    Type&nbsp;
                                <Tooltip title="Test Type">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            )}
                        >
                            {getFieldDecorator('type', {
                                rules: [{ required: true, message: 'Please input test name', whitespace: true }],
                            })(
                                <Input />
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
            ldx_id: Form.createFormField({
                ...props.ldx_id,
                value: props.ldx_id.value,
            }),
            type: Form.createFormField({
                ...props.type,
                value: props.type.value,
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