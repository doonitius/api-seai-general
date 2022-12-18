module.exports = {
  CREATE_SUCCESS: {
    code: 200,
    description: 'Data created successfully'
  },
  GET_SUCCESS: {
    code: 200,
    description: 'Data sent successfully'
  },
  UPDATE_SUCCESS: {
    code: 200,
    description: 'Data updated successfully'
  },
  DELETE_SUCCESS: {
    code: 200,
    description: 'Data deleted successfully'
  },
  MISSING_PARAMS: {
    code: 400,
    description: 'Missing required parameters'
  },
  INVALID_PARAMS: {
    code: 400,
    description: 'Invalid required parameters'
  },
  DUPLICATE_DATA: {
    code: 400,
    description: 'Data duplicated'
  },
  NOT_EXIST: {
    code: 404,
    description: 'Data is not exist'
  },
  NOT_FOUND: {
    code: 404,
    description: 'Data not found'
  },
}