import 'dotenv/config'
import { env } from './env';
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify';
import { authRoutes } from './routes/auth-routes';
import z, { ZodError } from 'zod';


export const app = fastify();


app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})

app.register(authRoutes, {prefix: '/auth'});


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

