import React, { Component } from 'react';
import styled from 'styled-components';
import Plot from 'react-plotly.js';

const SingleRepBox = styled.div``

const TableBox = styled.div``

const ChartBox = styled.div``

class SingleReport extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      projects: props.projects,
      title: props.title,
      chartData: []
    }
    /* chartData formatted as follows: 
    Arr = [{
      year: 
      sem: 
      
    }]
    */
  }
  
  componentDidMount() {
    
  }
  
  getChartData() {
    const selectedProj = this.state.projects.filter(proj => proj.title === this.state.title);
    
  }
  
  render() {
    return (
      <SingleRepBox>
        <h2>{this.state.title}</h2>
        <TableBox></TableBox>
        <ChartBox></ChartBox>
      </SingleRepBox>
    )
  }
}