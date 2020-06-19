import React, { Component } from 'react';
import axios from 'axios'; 
import styled from 'styled-components';
import { FaTimes, FaPen } from 'react-icons/fa';

const ItemBox = styled.div`
  display: flex;
`

const Info = styled.div``

const NumBox = styled.div``

const NumHead = styled.div``

const NumVal = styled.div``

const Controls = styled.div``

const Popup = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;  
  left: 0;  
  right: 0;  
  bottom: 0;  
  background-color: rgba(0,0,0, 0.5);  
`
const PopupInner = styled.div`
  position: absolute;  
  left: 25%;  
  right: 25%;  
  top: 25%;  
  bottom: 25%;  
  margin: auto;  
  border-radius: 20px;  
  background: white;  
`
const PopupInfo = styled.div``

const PopupInputs = styled.div``

const numDataArr = ['total', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'NPS'];

const editArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

class ViewListItem extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      projTitle: props.title,
      scoreObj: props.scoreData,
      origScore: {
        0: props.scoreData[0],
        1: props.scoreData[1],
        2: props.scoreData[2],
        3: props.scoreData[3],
        4: props.scoreData[4],
        5: props.scoreData[5],
        6: props.scoreData[6],
        7: props.scoreData[7],
        8: props.scoreData[8],
        9: props.scoreData[9],
        10: props.scoreData[10]
      },
      showPopup: false
    }
    this.editHandler = this.editHandler.bind(this);
    this.editScore = this.editScore.bind(this);
    this.selectDel = this.selectDel.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }
  
  componentDidMount() {
    console.log(this.state.scoreObj);
  }
  
  // Handles edit input values
  editHandler(event) {
    const key = event.target.name; 
    const scoreCopy = {...this.state.scoreObj, [key]: event.target.value};
    this.setState({scoreObj: scoreCopy}); 
  }
  
  // Submits updated data
  editScore() {
    const newScoreData = {...this.state.scoreObj};
    // Calculate total and NPS values 
    const detScores = [0, 1, 2, 3, 4, 5, 6];
    const promScores = [9, 10];
    let allStudents = 0;
    let detractors = 0;
    let promoters = 0;
    Object.keys(newScoreData).forEach(key => {
      if (editArr.includes(key)) {
        let scoreNum = parseInt(key);
        let scorers = parseInt(newScoreData[key]);
        allStudents += scorers;
        if (detScores.includes(scoreNum)) {detractors += scorers}; 
        if (promScores.includes(scoreNum)) {promoters += scorers}; 
      }
    })
    const calcNPS = ((promoters - detractors) / allStudents) * 100;  
    
    // Prepare and send data object for update
    newScoreData.total = allStudents;
    newScoreData.NPS = calcNPS; 
    
    axios
    .put(
      '/api/editData', 
      JSON.stringify(newScoreData),
      {headers: {"Content-Type": "application/json"}}
    )
    .then(res => {
      alert("Score data in project " + this.state.active + " updated");
      this.props.getProjects(); // Refresh project data
    })
    .then(() => {
      this.togglePopup(); // Close editing popup
    })
    .catch(err => console.log(err));
  }
  
  // Deletes selected score set and updates
  selectDel() {
    const delScoreObj = {
      title: this.state.projTitle,
      year: this.state.scoreObj.year,
      sem: this.state.scoreObj.semester
    }
    // Update database
    axios
    .put(
      '/api/removeData',
      JSON.stringify(delScoreObj),
      {headers: {"Content-Type": "application/json"}}
    )
    .then(res => {
      alert("Score dataset deleted from project " + this.state.projTitle);
      // refresh project data here
      this.props.getProjects();
    })
    .catch(err => console.log(err));
  }
  
  // Shows popup for score set editing
  togglePopup() {
    this.setState({showPopup: !this.state.showPopup});
  }
  
  render() {
    return (
      <React.Fragment>
        {/*Data display and controls*/}
        <ItemBox>
          <Info>
            <p>{this.state.scoreObj.year}</p>
            <p>{this.state.scoreObj.semester}</p>
          </Info>
          {numDataArr.map(key => 
            <NumBox>
              <NumHead>{key}</NumHead>
              <NumVal>{this.state.scoreObj[key]}</NumVal>
            </NumBox>
          )}
          <Controls>
            <button name="editScore" onClick={this.togglePopup}><FaPen/></button>
            <button name="deleteScore" onClick={this.selectDel}><FaTimes/></button>
          </Controls>
        </ItemBox>
        {/*Popup for editing of data set values*/}
        <div>
          {this.state.showPopup ? 
           <Popup>
             <PopupInner>
               <h4>Edit values</h4>
               <PopupInfo>
                 {this.state.scoreObj.year}
                 {this.state.scoreObj.semester}
               </PopupInfo>
               <PopupInputs>
               {editArr.map(key => 
                 <label>{key}
                   <input 
                     type="number" 
                     name={key} 
                     value={this.state.scoreObj[key]}
                     onChange={this.editHandler}
                     required
                   /></label>
               )}
               </PopupInputs>
               <button onClick={this.editScore}>Update</button>
               <button onClick={this.togglePopup}>Cancel</button>
             </PopupInner>
           </Popup>
           : null}
        </div>
      </React.Fragment>
    )
  }
}

export default ViewListItem; 

/* Data is structured as follows: 
scores: {hash table},
NPS: Number,
Year: Number,
Semester: Number

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