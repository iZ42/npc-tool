const express = require('express');
const router = express.Router();

const Project = require('./models/project');

// Retrieve all projects in database 
router.get('/projectsData', async(req, res) => {
  const getProjects = await Project.find({}, (err, qns) => {
    if (err) {
      return res.status(400).json({Success: false, Error: err})
    }
    res.status(200).json(qns); 
  })
  .catch(err => console.log(err));
})

// Add title of new project to DB
router.post('/addTitle', (req, res) => {
  let newProj = new Project;
  
  // If no data submitted 
  if(!req.body) {
    return res.status(400).json({Success: false, Error: "No project data provided."});
  }
  // Fill project data from submission
  newProj.title = req.body.title; 
  
  // Check for existing instance in DB
  Project.findOne({title: newProj.title}, (err, proj) => {
    if (err) {
      return res.json({Error: err}); 
    }
    if (proj) {
      return res.json({Error: 'Project already exists, unable to duplicate.'});
    }
    
    newProj.save(err => {
      if (err) {
        return res.status(400).json({Success: false, Error: err}); 
      }
      else {
        return res.status(201).json({Success: true, Project: newProj.title});
      }
    })
  })
})

// Add data to existing project 
router.put('/addData', (req, res) => {
  // If no data is submitted
  if (!req.body) {
    return res.status(400).json({Success: false, Error: "No score data submitted."});
  } 
  
  Project.findOne({title: req.body.title}, (err, proj) => {
    if (err) {
      return res.json({Error: err}); 
    }
    // Update project data and save
    proj.data.push(req.body.scoreData);
    proj.save(err => {
      if (err) {
        return res.status(400).json({Success: false, Error: err}); 
      }
      else {
        return res.status(201).json({Success: true, Message: proj.title + " scores updated."});
      }
    })
  })
})

// Remove data set from project
router.put('/removeData', (req, res) => {
  // If no data is submitted
  if (!req.body) {
    return res.status(400).json({Success: false, Error: "No score data submitted."});
  }
  
  Project.findOne({title: req.body.title}, (err, proj) => {
    if (err) {
      return res.json({Error: err}); 
    }
    // Find and remove score dataset 
    const delYear = req.body.year;
    const delSem = req.body.sem; 
    let index = proj.data.findIndex(scoreObj => scoreObj.year === delYear && scoreObj.semester === delSem);
    if (index === -1) {
      console.log("Could not find matching project.");
      return res.status(400).json({Error: "Matching project not found."});
    }
    proj.data.splice(index, 1);
    // Save updated project
    proj.save(err => {
      if (err) {
        return res.status(400).json({Success: false, Error: err}); 
      }
      else {
        return res.status(201).json({Success: true, Message: proj.title + " score set deleted."});
      }
    })
  })
})

// Edit existing project data 
router.put('/editData', (req, res) => {
  // If no data is submitted
  if (!req.body) {
    return res.status(400).json({Success: false, Error: "No score data submitted."});
  }
  
  Project.findOne({title: req.body.title}, (err, proj) => {
    if (err) {
      return res.json({Error: err}); 
    }
    // Find and remove score dataset 
    const editYear = req.body.year;
    const editSem = req.body.semester;
    let index = proj.data.findIndex(scoreObj => scoreObj.year === editYear && scoreObj.semester === editSem);
    if (index === -1) {
      console.log("Could not find matching project.");
      return res.status(400).json({Error: "Matching project not found."});
    }
    const newScoreData = {
      year: req.body.year,
      semester: req.body.sem,
      total: req.body.total,
      0: req.body[0],
      1: req.body[1],
      2: req.body[2],
      3: req.body[3],
      4: req.body[4],
      5: req.body[5],
      6: req.body[6],
      7: req.body[7],
      8: req.body[8],
      9: req.body[9],
      10: req.body[10],
      NPS: req.body.NPS
    }
    // Replace data with updated
    proj.data.splice(index, 1, newScoreData);
    proj.save(err => {
      if (err) {
        return res.status(400).json({Success: false, Error: err}); 
      }
      else {
        return res.status(201).json({Success: true, Message: proj.title + " score set updated."});
      }
    })
  })
})

// Delete entire project
router.delete('/removeProject', (req, res) => {
  const title = req.body.title; 
  
  Project.deleteOne({title: title}, err => {
     if (err) {
       return res.status(400).json({Success: false, Error: err});
     }
    else {
      return res.status(200).json({Success: true, Message: title + " deleted from database."});
    }
  })
})

module.exports = router;

/*
const newScoreObj = {
        title: this.state.active,
        data: {
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
*/



