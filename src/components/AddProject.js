import React from 'react';
import styled from 'styled-components';

const AddProj = styled.div``

const AddProject = (props) => {
  return (
    <AddProj>
      <h4>Add new project:</h4>
      <form id="addProj" method="post" action="/api/addTitle">
        <label>Title: 
          <input type="text" name="title"/>
        </label>
        <button type="submit">Add</button>
      </form>
    </AddProj>
  )
}

export default AddProject;

/*
Popup Styling: 

.popup {  
  position: fixed;  
  width: 100%;  
  height: 100%;  
  top: 0;  
  left: 0;  
  right: 0;  
  bottom: 0;  
  margin: auto;  
  background-color: rgba(0,0,0, 0.5);  
}  

.popup\_inner {  
  position: absolute;  
  left: 25%;  
  right: 25%;  
  top: 25%;  
  bottom: 25%;  
  margin: auto;  
  border-radius: 20px;  
  background: white;  
}
*/