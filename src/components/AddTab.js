import React from 'react';
import styled from 'styled-components';
import AddData from './AddData';
import AddProject from './AddProject';

const AddContainer = styled.div``

const AddTab = (props) => {
  // Find all project titles
  const titles = props.projects.map(proj => proj.title).sort();
  return (
    <AddContainer>
      <AddProject getProjects={props.getProjects}/>
      <AddData projects={props.projects} titles={titles} getProjects={props.getProjects}/>
    </AddContainer>
  )
}

export default AddTab; 

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