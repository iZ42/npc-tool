import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ViewListItem from './ViewListItem';

const ViewEditBox = styled.div``

const ProjSelect = styled.div``

const DeleteBox = styled.div``

const DeleteButton = styled.button``

const ViewContainer = styled.div``

class ViewEditTab extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      projects: props.projects,
      titles: [],
      currTitle: '',
      currProj: {}
    }
    this.getTitles = this.getTitles.bind(this);
    this.deleteProj = this.deleteProj.bind(this);
    this.selectProj = this.selectProj.bind(this);
  }
  
  componentDidMount() {
    this.getTitles(); 
  }
  
  // Delete entire project with all data from DB
  deleteProj() {
    let title = this.state.currTitle;
    if (window.confirm("Permanently delete " + title + "?")) {
      // Send deletion request to backend
      axios
      .delete(
        '/api/removeProject',
        {data: {title: title}}
      )
      .then(res => {
        alert(title + " deleted.");
      })
      .catch(err => console.log(err));
    }
  }
  
  // Retrieve list of titles from projects in state
  getTitles() {
    let titles = this.state.projects.map(proj => proj.title); 
    titles.sort();
    titles.unshift('');
    this.setState({titles: titles}); 
  }
  
  // Retrieve project to set as current
  selectProj(event) {
    const title = event.target.value;
    let proj;
    // If title is blank
    if (title === '') {
      proj = {}; 
    }
    else {
      const projArr = this.state.projects.filter(proj => proj.title === title); 
      proj = projArr[0];
    }  
    // Set current project in state
    this.setState({
      currProj: proj,
      currTitle: title
    }); 
  }
  
  render() {
    return (
      <ViewEditBox>
        <ProjSelect>
          <select onChange={this.selectProj}>
            {
              this.state.titles.map(title => 
                <option value={title}>{title}</option>
            )}
          </select>
        </ProjSelect><br/>
        <DeleteBox>
          <DeleteButton onClick={this.deleteProj}>
            Delete Project
          </DeleteButton>
        </DeleteBox>
        <ViewContainer>
          {
            this.state.currTitle === '' ? 
            <p>Select a project to view data</p> :
            (this.state.currProj.data.length === 0) ?
              <p>No score data found.</p> :
              this.state.currProj.data.map(scoreSet => 
                <ViewListItem 
                  scoreData={scoreSet}
                  title={this.state.currTitle}
                  getProjects={this.props.getProjects}
                />
              )
          }
        </ViewContainer>
      </ViewEditBox>
    )
  }
}

export default ViewEditTab; 

/* Data is structured as follows: 
scores: {hash table},
NPS: Number,
Year: Number,
Semester: Number

e.g.:
title: "Accounting Mobile Game (AMG)"
data: [{
  year: 2019,
  semester: 1,
  total: 198,
  0: 0,
  1: 0,
  2: 1,
  3: 2,
  4: 2,
  5: 15,
  6: 28,
  7: 40, 
  8: 47
  9: 26, 
  10: 37,
  NPS: 7.575758
}, 
{...}
]

*/