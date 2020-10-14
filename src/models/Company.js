const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema({
  id: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Company', CompanySchema)