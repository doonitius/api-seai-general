const mongoose = require('mongoose')


const thesis_project = mongoose.Schema({
  project_name: {
    type: String,
    required: true,
  },
  project_abstract: {
    type: String,
    required: false,
  },
  advisor_id: {
    type: Number,
    required: true,
  },
  academic_year: {
    type: String,
    required: true,
  },
  document_path: {
    type: String,
    required: false,
  },
  create_dt: {
    type: Date,
    required: true,
  },
  update_dt: {
    type: Date,
    required: true,
  },
  file_name: {
    type: String,
    required: false
  }
})


module.exports = mongoose.model('thesis_project', thesis_project)