const azure = require('azure-storage')
// import { BlobServiceClient } from "@azure/storage-blob"
const { BlobServiceClient } = require('@azure/storage-blob')
const { DefaultAzureCredential } = require('@azure/identity')
const fs = require('fs')
const httpStatus = require('./http_status')

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY
const connectionString = process.env.AZURE_STORAGE_URL
const defaultAzureCredential = new DefaultAzureCredential()

const blobServiceClient = new BlobServiceClient(connectionString, defaultAzureCredential)

// const storageAccount = azure.createBlobService(accountName, accountKey)

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

