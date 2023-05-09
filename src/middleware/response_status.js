const res = require('express/lib/response')

module.exports.setStatusSuccess = (status, data, total, total_page) => {
  const result = {
    status: {
      code: '',
      description: '',
    },
    data: {},
    total: {},
  }

  result.status.code = status.code
  result.status.description = status.description
  result.data = data
  result.total = total
  result.total_page = total_page

  res.status(status.code)
  return result
}

module.exports.setStatusError = (status, data) => {
  const result = {
    status: {
      code: '',
      description: '',
    },
    data: {},
  }

  result.status.code = status.businessCode ? status.businessCode : 5001
  result.status.description = status.description ? status.description : 'Others error'
  result.data = data

  if (status.description && status.description === 'Validate error') result.status.errors = status.errors

  res.status(status.code ? status.code : 500)
  return result
}