const mongoose = require('mongoose')

const nameSchema = mongoose.Schema({
  prefix: {
    type: String,
  },
  first_name: {
    type: String,
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
})

const advisor = mongoose.Schema(
  {
    eng: {
      nameSchema,
    },
    thai: {
      nameSchema,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

module.exports = mongoose.model('advisor', advisor)
