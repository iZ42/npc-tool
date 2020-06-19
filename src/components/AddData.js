import React, { Component } from 'react';
import axios from 'axios'; 
import styled from 'styled-components';

const AddDataBox = styled.form``

const AddScores = styled.div``

const Dropdown = styled.div``

const Year = styled.label``

const Sem = styled.label``

const scoreVals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; 

class AddData extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      projects: props.projects,
      titles: props.titles,
      active: props.titles[0],
      addYear: '',
      addSem: '',
      addScores: {}
    }
    this.handleScores = this.handleScores.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleYearSem = this.handleYearSem.bind(this);
    this.sendData = this.sendData.bind(this);
  }
  
  handleScores(event) {
    const score = event.target.name;
    const val = event.target.value;
    // Duplicate score object in state before setting
    const newScore = {...this.state.addScores, [score]: val};
    this.setState({addScores: newScore}); 
  }
  
  handleSelect(event) {
    this.setState({active: event.target.value}); 
  }
  
  handleYearSem(event) {
    const info = event.target.name;
    const val = event.target.value;
    this.setState({[info]: val}); 
  }
  
  sendData(event) {
    event.preventDefault();
    const inputYr = this.state.addYear; 
    const inputSem = this.state.addSem;
    let duplicate = true;
    
    // Check that dataset doesn't already exist
    const projArr = this.state.projects.filter(proj => proj.title === this.state.active);
    const proj = projArr[0];
    // Check for score set with matching year
    let yearChk, semChk;
    if (proj.data.length === 0) {
      duplicate = false;
    }
    else {
      yearChk = proj.data.filter(scoreSet => scoreSet.year === inputYr);
      console.log(yearChk);
      if (yearChk.length === 0) {
        duplicate = false; 
      }
      else {
        semChk = yearChk.filter(scoreSet => scoreSet.semester === inputSem); 
        if (semChk.length === 0) {duplicate = false;} 
      }
    }
    
    if (duplicate) {
      return alert("Data set already exists, unable to add duplicate.");
    }
    else {
      // Prepare data for saving to DB
      const scoreObj = this.state.addScores; 
      // To check if score belongs to detractors or promoters
      const detScores = [0, 1, 2, 3, 4, 5, 6];
      const promScores = [9, 10];
      
      // Track total, detractors, promoters 
      let allStudents = 0;
      let detractors = 0;
      let promoters = 0;
      Object.keys(scoreObj).forEach(score => {
        let scoreNum = parseInt(score);
        let scorers = parseInt(scoreObj[score]);
        allStudents += scorers; 
        if (detScores.includes(scoreNum)) {detractors += scorers}; 
        if (promScores.includes(scoreNum)) {promoters += scorers}; 
      })
      // Calculate NPS
      const calcNPS = ((promoters - detractors) / allStudents) * 100;  
      // Save new data set
      const newScoreObj = {
        title: this.state.active,
        scoreData: {
          year: inputYr,
          semester: inputSem,
          total: allStudents,
          0: scoreObj[0],
          1: scoreObj[1],
          2: scoreObj[2],
          3: scoreObj[3],
          4: scoreObj[4],
          5: scoreObj[5],
          6: scoreObj[6],
          7: scoreObj[7],
          8: scoreObj[8],
          9: scoreObj[9],
          10: scoreObj[10],
          NPS: calcNPS
        }
      }
      console.log(newScoreObj);
      
      // Update project in DB with new dataset
      axios
      .put(
        '/api/addData', 
        JSON.stringify(newScoreObj),
        {headers: {"Content-Type": "application/json"}}
      )
      .then(res => {
        alert("Score data added to project " + this.state.active)
        this.props.getProjects(); // Refresh project data
      })
      .catch(err => console.log(err));
    }
  }
  
  render() {
    return (
      <AddDataBox onSubmit={this.sendData}>
        {/*Dropdown to select title of existing project*/}
        <Dropdown>
          <select onChange={this.handleSelect}>
            {this.state.titles.map(title => 
                <option value={title}>{title}</option>
            )}
          </select>
        </Dropdown>
        {/*Add set of scores to project*/}
        <Year>Year:
          <input type="number" name="addYear" onChange={this.handleYearSem} required/>
        </Year>
        <Sem>Semester:
          <input type="number" name="addSem" onChange={this.handleYearSem} required/>
        </Sem>
        <AddScores>
          {
            scoreVals.map(score => 
              <label>{score}
                <input type="number" name={score} onChange={this.handleScores} required/>      
              </label>             
          )}
        </AddScores>
        <input type="submit"/> 
      </AddDataBox>
    )
  }
}

export default AddData;

  /* Data is structured as follows: 
  e.g.:
  title: "Accounting Mobile Game (AMG)"
  scores: [{
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
  