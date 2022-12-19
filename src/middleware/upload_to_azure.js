const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob')
const httpStatus = require('./http_status')

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY
const connectionString = process.env.AZURE_STORAGE_URL

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)

const blobServiceClient = new BlobServiceClient(connectionString, sharedKeyCredential)


const containerName = 'document'

const containerClient = blobServiceClient.getContainerClient(containerName)

const blobOptions = {
  blobHTTPHeaders: { blobContentType: 'application/pdf' }
}

module.exports.upLoadFile = async (file, fileName) => {
  try {
    fileBuffer = file.data
    
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)

    const response = await blockBlobClient.upload(fileBuffer, fileBuffer.length, blobOptions)

    return response
  } catch (error) {
    return httpStatus.NOT_FOUND
  }
}


module.exports.loadFile = async (fileName) => {
  try {

    const blockBlobClient = containerClient.getBlobClient(fileName)

    const response = await blockBlobClient.downloadToBuffer()

    return response
  } catch (error) {
    return httpStatus.NOT_FOUND
  }
}

