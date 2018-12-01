import React, { Component } from 'react';
import { Upload, Icon, message, Button, Card, Spin } from 'antd';
import { Storage } from 'aws-amplify';
import FileSaver from 'file-saver';


const Dragger = Upload.Dragger;

class S3FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadFile: null,
            s3FileKey: this.props.s3FileKey,
            report : this.props.report,
        }
        // this.listFiles()
        // this.uploadFile()
        // this.deleteFile()
    }

    uploadToS3 = () => {
        if (this.state.uploadFile) {
            const file = this.state.uploadFile; // file object from input
            const fileNameWoExt = file.name.slice(0, file.name.lastIndexOf("."))
            const fileExt = file.name.split(".").pop(); // split by '.' get last element which is extension
            const fileType = file.type; // content-type
            const date = new Date();
            const utcTimeStamp = Math.floor(date.getTime() / 1000)

            const user = localStorage.getItem('CognitoIdentityServiceProvider.34nred8unbrpigci3vkmn2nkhb.LastAuthUser')
            this.setState({
                loading: true,
                loadingMessage: 'uploading to S3...'
            });

            console.log("uploading to s3..." + this.state.uploadFile.name);
            const path = `email-report-dev/reports/${fileNameWoExt}/${user}/${utcTimeStamp}/${file.name}`
            Storage.put(path, file, {
                contentType: fileType
            })
                .then(result => {
                    this.setState({
                        // uploadFile: null,
                        loading: false,
                        s3FileKey: 'public/' + result.key,
                        report: fileNameWoExt
                    });

                    console.log("file uploaded and S3FileKey : ");
                    console.log('public/' + result.key);

                    // get file from S3
                    Storage.get(`${result.key}`)
                        .then(result => {
                            console.log("Got File from S3 :" + result);
                            this.setState({
                                resultUrl: result
                            })
                            message.success("File has successfully uploaded to aws S3");
                        })
                        .catch(err => message.error("File upload error"));
                })
                .catch(err => message.error("File upload error"));
        }
    }

    saveToState = ({ onSuccess, onError, file }) => {
        console.log('Custom Upload')
        console.log(file)
        console.log('File name : ' + file.name)
        console.log('File type : ' + file.type)
        console.log("file ext :" + file.name.split('.').pop());
        //walkaround for returning promoise
        setTimeout(() => {
            const newFile = { ...file }
            console.log(newFile)
            newFile.name = "test.pdf"
            this.setState({
                uploadFile: file,
                isFileHave: true,
            })
            onSuccess(null);
        }, 0);

    }

    prepareFile = (file, fileList) => {
        console.log(file)
    }

    removeFile = file => {
        console.log('from remove method')
        setTimeout(() => {
            this.setState({
                uploadFile: null
            })
            // message.success(`remove ok`);
            return true
        }, 0)
    }

    previewFunc = (file) => {
        console.log('preview')
        console.log(file.originFileObj)
        FileSaver.saveAs(file.originFileObj)
    }

    listFiles = () => {
        Storage.list('email-report-dev/')
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }

    uploadFile = () => {
        Storage.put('email-report-dev/naing-test.txt', 'Private Content', {
            level: 'public',
            contentType: 'text/plain'
        })
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }

    deleteFile = () => {
        Storage.remove('email-report-dev/naing-test.txt')
            .then(result => {
                console.log(result);
                alert("File has successfully deleted from aws S3");
            })
            .catch(err => console.log(err));
    };

    checkDisabled = () => {
        if (this.state.uploadFile)
            return true
        else if (this.state.s3FileKey)
            return true
        else
            return false

    }

    downloadFromS3 = () => {
        console.log(this.state.s3FileKey)
        // get file from S3
        Storage.get(this.state.s3FileKey.replace('public/', ''))
            .then(result => {
                console.log("Got File from S3 :" + result);
                window.open(result, '_blank')
            })
            .catch(err => message.error("File donwload error"));
    }

    deleteFromS3 = () => {
        this.setState({
            loading: true,
            loadingMessage: 'deleting file...'
        })

        Storage.remove(this.state.s3FileKey.replace('public/', ''))
            .then(result => {
                console.log(result);
                this.setState({
                    uploadFile: null,
                    s3FileKey: null,
                    fileList: null,
                    loading: false
                })
                this.forceUpdate();
                message.success("File has successfully deleted from aws S3");
            })
            .catch(err => message.error(err));
    }

    render() {
        const propsDragger = {
            fileList: this.state.fileList,
            multiple: false,
            // beforeUpload : this.prepareFile,
            customRequest: this.saveToState,
            onChange: (info) => {
                const status = info.file.status;
                console.log('ant upload componnent status : ' + status)
                this.setState({ fileList: [...info.fileList] });
                // if (status !== 'uploading') {
                //     console.log('not uploading..')
                //     console.log(info);
                // }
                // if (status === 'done') {
                //     message.success(`${info.file.name} file uploaded successfully.`);
                // } else if (status === 'error') {
                //     message.error(`${info.file.name} file upload failed.`);
                // }
            },
            onRemove: this.removeFile,
            showUploadList: true,
            disabled: this.checkDisabled(),
            onPreview: this.previewFunc
        };


        return (
            <div>
                <Card bordered={false}>
                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Dragger {...propsDragger}>
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Support only for a single pdf file upload. Strictly prohibit from uploading other files</p>
                        </Dragger>
                    </div>
                    {!this.state.s3FileKey && <Button type="primary" icon="cloud" onClick={this.uploadToS3} disabled={this.state.uploadFile ? false : true} loading={this.state.loading}>Upload To S3</Button>}
                    {this.state.s3FileKey && <Button type="primary" icon="cloud-download" onClick={this.downloadFromS3} style={{ marginRight: "20px" }}>Download</Button>}
                    {this.state.s3FileKey && <Button type="danger" icon="delete" onClick={this.deleteFromS3} loading={this.state.loading}>Delete From S3</Button>}

                    <Button type="primary" htmlType="submit" style={{ float: 'right' }}
                        disabled={this.state.s3FileKey ? false : true}
                        onClick={() => {
                            this.props.emailRenderHandler({
                                s3FileKey: this.state.s3FileKey,
                                report: this.state.report
                            })
                        }}>Next</Button>
                    <Button type="default" style={{ float: 'right', marginRight: "20px" }} onClick={this.props.back}  >Cancel</Button>
                </Card>
            </div >
        );
    }
}
export default S3FileUpload