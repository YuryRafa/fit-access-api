import 'dotenv/config'
import fastify from 'fastify';
import { appRoutes } from './routes/app-routes';
import z, { ZodError } from 'zod';
import { env } from './env';

export const app = fastify();


app.register(appRoutes, {prefix: '/api'});


app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError){
        return reply.status(400)
        .send({message: 'Validation error.', issues: z.treeifyError(error)})
    }

    if (env.NODE_ENV !== 'production'){
        console.error(error);

    } else {
        //TODO: log to an external tool
    }

    return reply.status(500).send({message: 'Internal Server Error.'});
});

