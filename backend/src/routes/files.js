import { Router } from 'express'
import multer from 'multer'
import { memoryStorage } from 'multer'
import { S3Client } from '@aws-sdk/client-s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'

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
    credentials: { accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_KEY }
})
const bucketName = process.env.AWS_BUCKET_NAME

routes.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file
    const { user } = req.query

    try {
        if (!file) return res.status(400).json({ message: 'No file uploaded! Please validate type file' })
        if (!user) return res.status(400).json({ message: 'No user!' })

        const keyObject = `${user}/${file.originalname}`

        const putCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: keyObject,
            Body: file.buffer,
            ContentType: file.mimetype
        })

        const result = await s3.send(putCommand)

        res.status(201).json({ message: 'file upload successfully!', keyObject })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

routes.delete('/', async (req, res) => {
    const { id } = req.query

    try {
        if (!id) return res.status(400).json({ message: 'Id not found!' })

        const command = new DeleteObjectCommand({ Bucket: bucketName, Key: id })
        const response = await s3.send(command)

        res.status(200).json({ message: 'Delete successfully!' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default routes
