import { Router } from 'express'
import multer from 'multer'
import { memoryStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import fs from 'node:fs'

import { S3Client } from '@aws-sdk/client-s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { ListObjectsCommand } from '@aws-sdk/client-s3'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'

import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'

const routes = Router()
const upload = multer({
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/(jpg|jpeg|png|gif|bmp)$/)) return cb(null, false)
        cb(null, true)
    },
    limits: { fileSize: '10MB' }
})

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
})
const bucketName = process.env.AWS_BUCKET_NAME

routes.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file
    const { user } = req.query

    try {
        if (!file) return res.status(400).json({ message: 'No file uploaded! Please validate type file' })
        if (!user) return res.status(400).json({ message: 'No user!' })

        const id = uuidv4()
        const keyObject = `${user}/${id}.${file.mimetype.split('/')[1]}`

        const putCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: keyObject,
            Body: file.buffer,
            ContentType: file.mimetype
        })

        await s3.send(putCommand)

        const getCommand = new GetObjectCommand({ Bucket: bucketName, Key: keyObject })
        const url = await getSignedUrl(s3, getCommand)

        res.status(201).json({ message: 'file upload successfully!', key: keyObject, url })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

routes.delete('/', async (req, res) => {
    const { id, user } = req.query

    try {
        if (!id || !user) return res.status(400).json({ message: 'Id or user not found!' })

        const command = new DeleteObjectCommand({ Bucket: bucketName, Key: `${user}/${id}` })
        const response = await s3.send(command)
        console.log(response)

        res.status(200).json({ message: 'Delete successfully!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

routes.get('/', async (req, res) => {
    const { key, download } = req.query
    if (!key || typeof key !== 'string' || key.trim().length === 0)
        return res.status(400).json({ message: 'Invalid key!' })

    try {
        const command = new GetObjectCommand({ Bucket: bucketName, Key: key })
        const response = await s3.send(command)

        if (typeof download === 'string' && download.toLowerCase() === 'true') {
            res.setHeader('Content-Type', response.ContentType)
            res.setHeader('Content-Disposition', `attachment; file="${key}"`)
            return response.Body.pipe(res)
        }

        const url = await getSignedUrl(s3, command)
        res.status(200).json({ message: 'Get successfully!', url })
    } catch (error) {
        if (error.Code === 'NoSuchKey') return res.status(404).json({ message: 'File not found!' })
        if (error.Code === 'AccessDenied') return res.status(403).json({ message: 'Access denied!' })
        res.status(500).json({ message: error.message })
    }
})

routes.get('/list', async (req, res) => {
    const { user } = req.query
    try {
        if (!user) return res.status(400).json({ message: 'No user!' })

        const command = new ListObjectsCommand({ Bucket: bucketName, Prefix: user })
        const result = await s3.send(command)

        console.log(result)
        const listFiles = result.Contents?.map((file) => file.Key)

        res.status(200).json({ message: 'List successfully!', result: listFiles })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default routes
