import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

console.log()

export const swaggerConfig = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'Skeleton API with Express and Node.js',
            description: '-',
            contact: {
                name: 'Bryan Solares',
                url: 'https://bryan-solares.com',
                email: 'solares.josue@outlook.com'
            },
            version: '0.1.0'
        },
        servers: [{ url: `http://localhost:${process.env.PORT}/`, description: 'Development Server' }]
    },
    apis: [path.join(__dirname, '../routes/index.js')]
}
