import 'reflect-metadata';
import routes from './src/shared/infra/http/routes';
import { createConnection } from 'typeorm';
import express, { NextFunction, Request, Response } from 'express';
import AppError from './src/shared/errors/AppErrors';
import { errors } from 'celebrate';

const app = express();

app.use(express.json());

createConnection();

app.use(routes);

app.use(errors());

app.use(
    (error: Error, request: Request, response: Response, next: NextFunction) => {
        if (error instanceof AppError) {
            return response.status(error.statusCode).json({
                status: 'error',
                message: error.message,
            });
        }

        return response.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    },
);

app.listen(3000, () => {
    console.log("Server started on port 3000");
})