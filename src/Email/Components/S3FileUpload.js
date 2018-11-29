import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';

const Dragger = Upload.Dragger;

class S3FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadFile: null,
        }
    }

    uploadToS3 = ({ onSuccess, onError, file }) => {
        console.log('Custom Upload')
        console.log(file)
        console.log('File name : ' + file.name)
        console.log('File type : ' + file.type)
        console.log("file ext :" + file.name.split('.').pop());

        //uploading simulation
        setTimeout(() => {
            const newFile = { ...file }
            console.log(newFile)
            newFile.name = "test.pdf"
            this.setState({
                uploadFile: file,
                isFileHave: true,
            })
            onSuccess(null);
        }, 3000);

    }

    removeFile = file => {
        console.log('from remove method')
        setTimeout(() => {
            this.setState({
                uploadFile: null
            })
            message.success(`remove ok`);
            return true
        },2000)
     
    }

    previewFunc = (file) => {
        console.log('preview')

    }

    render() {

        const propsDragger = {
            multiple: false,
            customRequest: this.uploadToS3,
            onChange(info) {
                const status = info.file.status;
                console.log(status)

                if (status !== 'uploading') {
                    console.log('not uploading..')
                    console.log(info);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
            onRemove: this.removeFile,
            showUploadList: true,
            disabled: this.state.uploadFile ? true : false,
            onPreview: this.previewFunc
        };

        const s3FileInfo = (
            <p>this is s3 file info</p>
        );
        
        return (
            <div>
            <div style={{ marginTop: '20px' }}>
                <Dragger {...propsDragger}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Support only for a single pdf file upload. Strictly prohibit from uploading other files</p>
                </Dragger>
            </div>
            <div style={{ marginTop: '20px' }} >
                {this.state.uploadFile && s3FileInfo}
            </div>
            </div>
        );
    }
}
export default S3FileUpload