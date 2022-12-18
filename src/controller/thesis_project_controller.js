const { setStatusSuccess, setStatusError } = require('../middleware/response_status')
const mime = require('mime-types')
const httpStatus = require('../middleware/http_status')
const azure = require('azure-storage')
const uuid = require('uuid')

const thesis_project = require('../model/thesis_project_model')

const { upLoadFile, loadFile } = require('../middleware/upload_to_azure')

module.exports.getProjectById = async (req, res) => {
  try {
    const { project_id } = req.params

    const foundProject = await thesis_project.findOne({ project_id: project_id })
    if (!foundProject) throw httpStatus.NOT_EXIST

    res.send(setStatusSuccess(httpStatus.GET_SUCCESS, foundProject))
  } catch (error) {
    res.send(setStatusError(error, null))
  }
}

module.exports.previewDocument = async (req, res) => {
  try {
    const { file_name } = req.params
    console.log(typeof(file_name));
    if (file_name) {
      const result = await loadFile(file_name)
      res.contentType(mime.contentType(file_name))
      res.send(result)
    } else {
      throw httpStatus.NOT_FOUND
    }

  } catch (error) {
    res.send(setStatusError(error, null))
  }
}

module.exports.createProject = async (req, res) => {
  try {
    fileName = `${uuid.v4()}.pdf`
    var current_date = new Date()
    const newProject = new thesis_project({
      ...req.body,
      create_dt: current_date,
      update_dt: current_date,
      file_name: fileName
    })

    const savedProject = await newProject.save()

    if (savedProject && (req.files || req.files.thesis_file)){
      await upLoadFile(req.files.thesis_file, fileName)

    }

    res.send(setStatusSuccess(httpStatus.CREATE_SUCCESS, savedProject))
  } catch (error) {
    console.error(error);
    res.send(setStatusError(error, null))
  }
}