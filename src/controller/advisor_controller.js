const { setStatusSuccess, setStatusError } = require('../middleware/response_status')
const httpStatus = require('../middleware/http_status')
const uuid = require('uuid')

const advisor = require('../model/advisor_model')

module.exports.inquiryAdvisor = async (req, res) => {
  try {
    const { search } = req.query

    let result

    if (search && search != '') {
      let pipeline = [
        {
          $search: {
            index: 'advisor',
            compound: {
              should: [
                {
                  autocomplete: {
                    query: `${search}`,
                    path: 'eng.first_name',
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 3,
                    },
                  },
                },
                {
                  autocomplete: {
                    query: `${search}`,
                    path: 'eng.last_name',
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 3,
                    },
                  },
                },
                {
                  autocomplete: {
                    query: `${search}`,
                    path: 'thai.first_name',
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 3,
                    },
                  },
                },
                {
                  autocomplete: {
                    query: `${search}`,
                    path: 'thai.last_name',
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 3,
                    },
                  },
                },
              ],
              minimumShouldMatch: 0,
            },
          },
        },
        {
          $match: search ? {} : { $expr: { $eq: [true, true] } },
        },
      ]
      result = await advisor.aggregate(pipeline)
    } else {
      result = await advisor.find()
    }

    res.send(setStatusSuccess(httpStatus.GET_SUCCESS, result))
  } catch (error) {
    console.log(error)
    res.send(setStatusError(error, null))
  }
}

module.exports.getAdvisorById = async (req, res) => {
  try {
    const { advisor_id } = req.params

    const result = await advisor.findOne({ _id: advisor_id }, { __v: 0 })
    
    res.send(setStatusSuccess(httpStatus.GET_SUCCESS, result))
  } catch (error) {
    res.send(setStatusError(error, null))
  }
}
