import React, { Component } from 'react';
import logo from './logo.svg';
import MyEditor from './MyEditor';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import './App.css';
class App extends Component {

  constructor(props) {
    super(props);
    const html = '<html><head><meta content="text/html; charset=UTF-8" http-equiv="content-type"><style type="text/css">ol{margin:0;padding:0}table td,table th{padding:0}.c0{color:#222222;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:10pt;font-family:"Arial";font-style:normal}.c2{padding-top:0pt;padding-bottom:0pt;line-height:1.15;orphans:2;widows:2;text-align:left;height:11pt}.c4{color:#000000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:11pt;font-family:"Arial";font-style:normal}.c1{color:#222222;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:9.5pt;font-family:"Arial";font-style:normal}.c3{padding-top:0pt;padding-bottom:0pt;line-height:1.15;orphans:2;widows:2;text-align:left}.c8{padding-top:0pt;padding-bottom:0pt;line-height:1.1500022727272727;orphans:2;widows:2;text-align:left}.c9{text-decoration:none;vertical-align:baseline;font-family:"Arial";font-style:normal}.c6{font-size:10pt;color:#222222;font-weight:700}.c10{color:#000000;font-weight:400;font-size:9.5pt}.c13{color:#000000;font-weight:400}.c14{max-width:487.3pt;padding:51.1pt 54pt 56.9pt 54pt}.c5{color:#222222;font-size:9.5pt}.c15{font-style:italic}.c11{font-size:10pt}.c7{background-color:#ffffff}.c12{color:#222222}.c16{color:#1155cc}.title{padding-top:0pt;color:#000000;font-size:26pt;padding-bottom:3pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}.subtitle{padding-top:0pt;color:#666666;font-size:15pt;padding-bottom:16pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}li{color:#000000;font-size:11pt;font-family:"Arial"}p{margin:0;color:#000000;font-size:11pt;font-family:"Arial"}h1{padding-top:20pt;color:#000000;font-size:20pt;padding-bottom:6pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h2{padding-top:18pt;color:#000000;font-size:16pt;padding-bottom:6pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h3{padding-top:16pt;color:#434343;font-size:14pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h4{padding-top:14pt;color:#666666;font-size:12pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h5{padding-top:12pt;color:#666666;font-size:11pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}h6{padding-top:12pt;color:#666666;font-size:11pt;padding-bottom:4pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;font-style:italic;orphans:2;widows:2;text-align:left}</style></head><body class="c7 c14"><p class="c3"><span class="c1">Dear Min-Han,</span></p><p class="c2"><span class="c1"></span></p><p class="c3"><span class="c5">Please see the attached for Report NPC GOLD-BL-SG-18-01012-180926.</span></p><p class="c3"><span class="c1">(I&#39;ve also uploaded the report to #report&gt;%inbox)</span></p><p class="c2"><span class="c1"></span></p><p class="c3"><span class="c1">SUMMARY</span></p><p class="c8"><span class="c1">NEGATIVE.</span></p><p class="c8"><span class="c5">EBV </span><span class="c5 c15">Bam</span><span class="c1">HI-W DNA absent or below the lower limit of detection.</span></p><p class="c2"><span class="c1"></span></p><p class="c3"><span class="c5">Ordering clinician: Dr. </span><span class="c9 c6">TAN MIN HAN</span></p><p class="c3"><span class="c11 c12">LUCENCE DIAGNOSTIC MEDICAL CENTRE</span></p><p class="c2"><span class="c0"></span></p><p class="c3"><span class="c11">(Acc ID: PLS-191) </span><span class="c11 c16">(Delay reporting. report sent out on 16/10/2018)Email: SG.ParkwayGenetics@parkwaypantai.com /cc joycepi.lim@parkwaypantai.com</span><span class="c9 c11 c13">&nbsp; // order tracking</span></p><p class="c3"><span class="c0">Copied to: Parkway Laboratory Services Ltd</span></p><p class="c2"><span class="c0"></span></p><p class="c3"><span class="c1">Date Collected: 25 Sep 2018</span></p><p class="c3"><span class="c1">Date Received: 26 Sep 2018</span></p><p class="c3"><span class="c5">Expected TAT (5 working days): 10 Oct 2018</span></p><p class="c2"><span class="c0"></span></p><p class="c3"><span class="c1">Checklist for cross-checking.</span></p><p class="c2"><span class="c1"></span></p><p class="c3"><span class="c5">Right Sample ID - yes //</span><span class="c9 c6">BL-SG-18-01012</span></p><p class="c3"><span class="c5">Right Patient Name, Gender, MRN - yes &nbsp; //</span><span class="c6">TAN PHENG</span><span class="c5">, Female, </span><span class="c0">00064</span></p><p class="c3"><span class="c5">Right Test Ordered - yes &nbsp;//</span><span class="c6">NPC GOLD&trade; (EBV </span><span class="c6 c15">Bam</span><span class="c6 c9">HI-W CpG DNA)</span></p><p class="c3"><span class="c1">Right Date of Report- yes &nbsp; //12 Nov 2018</span></p><p class="c3"><span class="c5">Right Order ID - yes //</span><span class="c0">18-3371</span></p><p class="c3"><span class="c1">....</span></p><p class="c3"><span class="c1">INDICATION</span></p><p class="c3"><span class="c1">TESTING</span></p><p class="c2"><span class="c1"></span></p><p class="c3"><span class="c5">Purpose: Screening/</span><span class="c5 c7">Diagnosis/Monitoring</span></p><p class="c3"><span class="c1">Known disease and/or cancer: Yes (NPC) /No</span></p><p class="c2"><span class="c1"></span></p><p class="c3"><span class="c1">Thank you.</span></p><p class="c3"><span class="c1">Regards,</span></p><p class="c3"><span class="c1">Wai Min</span></p><p class="c2"><span class="c4"></span></p></body></html>';
    const contentBlock = htmlToDraft(html);
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
    console.log(JSON.stringify(text));
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className="App">
        <header className="App-header">

            Learn React

        </header>
        <div style={{margin:"50px",padding:"40px",border:"3px solid blue"}}>


        <Editor 
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
   
  

        </div>
      </div>
    );
  }
}

export default App;
