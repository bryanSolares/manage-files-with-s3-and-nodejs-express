import { Router } from 'express'

import jsDocsConfig from 'swagger-jsdoc'
import uiDoc from 'swagger-ui-express'
import { swaggerConfig } from '../config/swagger.js'

import files from './files.js'

const configDocumentation = jsDocsConfig(swaggerConfig)

const routes = Router()

routes.use('/api/documentation', uiDoc.serve, uiDoc.setup(configDocumentation))

/**
 * @swagger
 * tags:
 *  name: Health
 *  description: Check health API
 * /:
 *  get:
 *      summary: Health check API
 *      tags: [Health]
 *      responseBody:
 *          description: This is a description
 *          content:
 *              application/json:
 *      responses:
 *          200:
 *              description: "Successfully health check"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 */
routes.get('/', (_, res) => {
    res.status(200).json({ message: '😃 everything works ✅' })
})

/**
 * @swagger
 * tags:
 *  name: Manage files
 *  description: Manage files into S3 Bucket
 * paths:
 *  /api/v1/files/upload/:
 *      post:
 *          summary: Upload file into S3 Bucket
 *          tags: [Manage files]
 *          parameters:
 *              - in: formData
 *                name: file
 *                type: file
 *                required: true
 *              - in: query
 *                name: user
 *                type: string
 *                required: true
 *          responses:
 *              201:
 *                  description: "Successfully upload file"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                  key:
 *                                      type: string
 *                                  url:
 *                                      type: string
 *              400:
 *                  description: "No user or file!"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *              500:
 *                  description: "Internal server error!"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *
 *  /api/v1/files/:
 *     delete:
 *      summary: Delete file into S3 Bucket
 *      tags: [Manage files]
 *      parameters:
 *          - in: query
 *            name: id
 *            type: string
 *            required: true
 *          - in: query
 *            name: user
 *            type: string
 *            required: true
 *      responses:
 *          200:
 *              description: "Successfully delete file"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *          400:
 *              description: "No user or id!"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *          500:
 *              description: "Internal server error!"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *
 *  /api/v1/files:
 *      get:
 *          summary: Get file from S3 Bucket
 *          tags: [Manage files]
 *          parameters:
 *              - in: query
 *                name: key
 *                type: string
 *                required: true
 *              - in: query
 *                name: download
 *                required: false
 *                description: "true or false"
 *                schema:
 *                  type: string
 *                  enum: [true, false]
 *          responses:
 *              200:
 *                  description: "Successfully get file"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                  url:
 *                                      type: string
 *              400:
 *                  description: "No key!"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *              404:
 *                  description: "File not found!"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *              403:
 *                  description: "Access denied!"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *              500:
 *                  description: "Internal server error!"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *
 *  /api/v1/files/list:
 *      get:
 *          summary: List files into S3 Bucket
 *          tags: [Manage files]
 *          parameters:
 *              - in: query
 *                name: user
 *                type: string
 *                required: true
 *          responses:
 *              200:
 *                  description: "Successfully list files"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                  url:
 *                                      type: string
 *              400:
 *                  description: "No user!"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *              500:
 *                  description: "Internal server error!"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *
 */
routes.use('/api/v1/files', files)

export default routes
