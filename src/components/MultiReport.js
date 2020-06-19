import React, { Component } from 'react';
import styled from 'styled-components';
import Plot from 'react-plotly.js';

const ReportBox = styled.div``

const SemData = styled.div``

const TableSection = styled.table``

const GraphSection = styled.div``

class MultiReport extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      projects: props.projects,
      selectedTitles: props.titles,
      semData: []
       /*semData structure: 
        [{
          year:
          sem:
          scores: [{title, total, 0, 1, 2, ... 10, NPS}]
        }, ...]*/
    }
    this.initialSort = this.initialSort.bind(this);
    
  }
  
  componentDidMount() {
    this.initialSort();
  }
  
  initialSort() {
    // Copy projects from state 
    const allProjs = Array.from(this.state.projects);
    // Retrieve projects of interest
    let activeProjs = allProjs.filter(proj => this.state.selectedTitles.includes(proj.title));
    let semsCatalogue = {}; // {year: 1, 2}
    let reordered = []; // Array of objects arranging data by year and sem 
    
    // Go through projects, sorting by time 
    activeProjs.map(proj => {
      let title = proj.title;
      proj.data.map(scoreSet => {
        let year = scoreSet.year; 
        let sem = scoreSet.semester; 
        // Check if year and sem are present in catalogue
        if (!Object.keys(semsCatalogue).includes(year)) {
          semsCatalogue.year = [sem];
        }
        else if (!semsCatalogue.year.includes(sem)) {
          semsCatalogue.year.push(sem).sort();  
        }
        // First entry in reordered
        if (reordered.length === 0) {
          reordered.push({
            year: year,
            semester: sem,
            scores: [{
              title: title,
              total: scoreSet.total,
              0: scoreSet[0],
              1: scoreSet[1],
              2: scoreSet[2],
              3: scoreSet[3],
              4: scoreSet[4],
              5: scoreSet[5],
              6: scoreSet[6],
              7: scoreSet[7],
              8: scoreSet[8],
              9: scoreSet[9],
              10: scoreSet[10],
              NPS: scoreSet.NPS
            }]
          })
        }
        // Corresponding year and sem object doesn't exist
        else if (reordered.findIndex(obj => obj.year === year && obj.semester === sem) === -1) {
          reordered.push({
            year: year,
            semester: sem,
            scores: [{
              title: title,
              total: scoreSet.total,
              0: scoreSet[0],
              1: scoreSet[1],
              2: scoreSet[2],
              3: scoreSet[3],
              4: scoreSet[4],
              5: scoreSet[5],
              6: scoreSet[6],
              7: scoreSet[7],
              8: scoreSet[8],
              9: scoreSet[9],
              10: scoreSet[10],
              NPS: scoreSet.NPS
            }]
          })
        }
        // Add score data to existing object in array 
        else {
          let index = reordered.findIndex(obj => obj.year === year && obj.semester === sem);
          reordered[index].scores.push({
            title: title,
            total: scoreSet.total,
            0: scoreSet[0],
            1: scoreSet[1],
            2: scoreSet[2],
            3: scoreSet[3],
            4: scoreSet[4],
            5: scoreSet[5],
            6: scoreSet[6],
            7: scoreSet[7],
            8: scoreSet[8],
            9: scoreSet[9],
            10: scoreSet[10],
            NPS: scoreSet.NPS
          })
          // Sort score data by title
          reordered[index].scores.sort((obj1, obj2) => {
            let name1 = obj1.title.toLowerCase();
            let name2 = obj2.title.toLowerCase();
            // No conditions where names are equal
            if (name1 < name2) {
              return -1;
            }
            if (name2 > name1) {
              return 1;
            }
            return 0;
          })
        }
      })
    })
    // Sort each array in reordered data 
    reordered.sort((objA, objB) => {
      if (objA.year < objB.year) {
        return -1; 
      }
      else if (objA.year > objB.year) {
        return 1; 
      }
      else if (objA.year === objB.year) {
        if (objA.sem < objB.sem) {
          return -1;
        }
        if (objB.sem > objA.sem) {
          return 1;
        }
      }
    })
    this.setState({semData: reordered});
  }
  
  render() {
    return (
      <ReportBox>
        {this.state.semData.map(semData => 
          <SemData>
            {semData.year}
            {semData.sem}
            <TableSection>
              <tr>
                <th>Project</th>
                <th>Students</th>
                <th>0</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
                <th>8</th>
                <th>9</th>
                <th>10</th>
                <th>NPS</th>
              </tr>
              {
                semData.scores.map(scoreSet => {
                  Object.keys(scoreSet).map(key => 
                    <td>{scoreSet.key}</td>
                  )
                })
              }  
              
              {/*semData structure: 
                [{
                  year:
                  sem:
                  scores: [{title, total, 0, 1, 2, ... 10, NPS}]
                }, ...]*/}
              
            </TableSection>
            <GraphSection>
              <Plot
                data={[
                  {
                    x: semData.scores.map(scoreSet => scoreSet.NPS),
                    y: semData.scores.map(scoreSet => scoreSet.title),
                    type: 'bar'
                  }
                ]}
                layout={ {width: 320, height: 240, title: semData.year + " Semester " + semData.sem}}
              />
            </GraphSection>
          </SemData>
        )}
      </ReportBox>
    )
  }
}

export default MultiReport; 

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