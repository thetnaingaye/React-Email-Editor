import React, { Component } from 'react';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';


class EmailEditor extends Component {

    constructor(props) {
        super(props);
        const contentBlock = htmlToDraft(this.props.html);

        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        }
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

    sendEmailHanlder = () => {
        const subject = this.state.subject
        const html = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        this.props.send({
            subject : subject,
            html : html
        })
    }
    
    render() {
        const { editorState } = this.state;

        return (
            <div style={{ padding: '20px',backgroundColor:'#fff' }}>
                <div className="ant-row ant-form-item">
                    <div className="ant-form-item-label ant-col-xs-24 ant-col-sm-24 ant-col-md-1 ant-col-lg-1">
                        <label htmlFor="subject" className="col-form-label">Subject</label>
                    </div>
                    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-24 ant-col-md-23 ant-col-lg-23">
                        <div className="ant-form-item-control">
                            <input type="text" id="subject" className="ant-input" placeholder="Subject" onChange={(e) => this.setState({ subject: e.target.value })} />
                        </div>
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
                    <button className="ant-btn ant-btn-primary" onClick={this.sendEmailHanlder} style={{ marginRight: "20px" }}>Send Email</button>
                    <button className="ant-btn ant-btn-danger" onClick={this.props.back}>Back</button>
                </div>
            </div>
        );
    }
}

export default EmailEditor