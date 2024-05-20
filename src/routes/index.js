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
 *  description: Upload file to S3
 * /api/v1/files/upload:
 *  post:
 *      summary: Upload file API
 *      tags: [Manage files]
 *      responseBody:
 *          description: Status upload file
 *          content:
 *              application/json:
 *      responses:
 *          200:
 *              description: "Successfully upload file"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              keyObject:
 *                                  type: string
 *
 *
 *  /api/v1/files/delete:
 *  delete:
 *      summary: Delete file API
 *      tags: [Manage files]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *      responses:
 *          200:
 *              description: "Delete successfully!"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 */
routes.use('/api/v1/files', files)

export default routes
