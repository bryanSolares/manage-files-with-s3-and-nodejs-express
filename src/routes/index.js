import { Router } from 'express'

import jsDocsConfig from 'swagger-jsdoc'
import uiDoc from 'swagger-ui-express'
import { swaggerConfig } from '../config/swagger.js'

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

export default routes
