const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  data: Array
})

/* Data is structured as follows: 
scores: {hash table},
NPS: Number,
Year: Number,
Semester: Number
*/

module.exports = mongoose.model("project", projectSchema);

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