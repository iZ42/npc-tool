import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import styled from 'styled-components';
import Home from './components/Home';
import AddTab from './components/AddTab';
import ViewEditTab from './components/ViewEditTab';

class App extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      activeTab: 'home',
      projects: []
    }
    this.getProjects = this.getProjects.bind(this);
  }
  
  componentDidMount(){
    this.getProjects();
  }
  
  // Retrieves data of all projects in DB
  getProjects() {
    fetch('/api/projectsData')
    .then(res => res.json())
    .then(data => {
      this.setState({projects: data}, () => console.log(this.state.projects));
    })
    .catch(err => console.log(err));
  }
  
  render() {
    return (
      <React.Fragment>
        <h2>Under Construction</h2>
        {/* Tab bar and content */}
        <Tabs>
          <TabList>
            <Tab>Home</Tab>
            <Tab>Add Project Data</Tab>
            <Tab>View & Edit</Tab>
          </TabList>
          <TabPanel>
            <Home projects={this.state.projects} getProjects={this.getProjects}/>
          </TabPanel>
          <TabPanel>
            <AddTab projects={this.state.projects} getProjects={this.getProjects}/>
          </TabPanel>
          <TabPanel>
            <ViewEditTab projects={this.state.projects} getProjects={this.getProjects}/>
          </TabPanel>
        </Tabs>
      </React.Fragment>
    )
  }
}

export default App; 