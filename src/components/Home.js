import React, { Component } from 'react';
import styled from 'styled-components';
//import html2canvas from 'html2canvas';
import jsPdf from 'jspdf';
import SingleReport from './SingleReport';
import MultiReport from './MultiReport';

const SingleProject = styled.div``

const MultiProject = styled.div``

class Home extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      projects: props.projects,
      titleList: [],
      singleTitle: '',
      multiTitle: '',
      activeList: [],
      reportMode: null,
      isReporting: false
    }
    this.getTitles = this.getTitles.bind(this);
    //this.downloadReport = this.downloadReport.bind(this);
    this.singleProjSelect = this.singleProjSelect.bind(this);
    this.singleReport = this.singleReport.bind(this);
  }
  
  componentDidMount() {
    this.getTitles();
  }
  
  // Populate list of titles in state
  getTitles() {
    const titleArr = this.state.projects.map(proj => proj.title);
    this.setState({titleList: titleArr}, () => console.log(titleArr)); 
  }
  /*
  downloadReport() {
    const dom = document.getElementById('root');
    html2canvas(dom)
    .then(canvas => {
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPdf();
      pdf.addImage(img, 'PNG', 10, 10, 200, 200);
      pdf.save('report.pdf');
    })
  }
  */
  singleProjSelect(event) {
    const selected = event.target.value;
    this.setState({activeTitle: selected});
  }
  
  singleReport() {
    this.setState({
      reportMode: "Single",
      isReporting: true
    })
  }
  
  multiProjSelect(event) {
    this.setState({multiTitle: event.target.value});
  }
  
  multiProjAdd() {
    const title = this.state.multiTitle; 
    let titleArr = Array.from(this.state.activeList);
    if (!titleArr.includes(title)) {
      titleArr.push(title);
      titleArr.sort();
      this.setState({activeList: titleArr});
    }
  }
  
  render() {
    return (
      <React.Fragment>
        <div>
          <h4>Under Construction!</h4>
          {/*<button onClick={this.downloadReport}>Download Snapshot</button>*/}
        </div>
        <SingleProject>
          <h4>Select a project to view NPS across semesters:</h4>
          <select onChange={this.singleProjSelect}>
            {
              this.state.titleList.map(title => 
                <option value={title}>{title}</option>
              )
            }
          </select>
          <button onClick={this.singleReport}>Select</button>
        </SingleProject>
        <MultiProject>
          <select onChange={this.multiProjSelect}>
            {
              this.state.titleList.map(title => 
                <option value={title}>{title}</option>
              )
            }
          </select>
          <button onClick={this.multiProjAdd}>Add Project</button>
          <div>
          {
            this.state.activeList.length !== 0 ? 
            this.state.activeList.map(title => <p>{title}</p>) :
            null
          }
          </div>
        </MultiProject>
      </React.Fragment>
    )
  }
}

export default Home; 

/*

<select onChange={this.selectProj}>
  {
    this.state.titles.map(title => 
      <option value={title}>{title}</option>
  )}
</select>

const App = () => (
  <div>
    <PDFDownloadLink document={<MyDoc />} fileName="somename.pdf">
      {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
    </PDFDownloadLink>
  </div>
)

- List of selected projects 
- Time start and end
- Two types of graphs: 
  -> Single project, all datasets arranged chronologically
  -> Multiple projects, select period of time 
- PhantomJS to create downloadable report 
*/