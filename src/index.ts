import express from 'express';
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { mainRouter } from './routes/main.router';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
//import swaggerJSDoc from "swagger-jsdoc";
//import { options } from './swaggerOptions';
import morgan from 'morgan';
const app: express.Application = express();
const port = 3000 || process.env.PORT;
const address = `0.0.0.0:${port}`;

//app.use(morgan("common"));

//const swaggerSpec = swaggerJSDoc(options);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());

mainRouter(app);

app.get('/', (_req: Request, res: Response): void => {
    res.send('Welcome to Sakkeny!');
});

app.use((_req: Request, res: Response): void => {
    res.json({ Message: "I'm sorry, There is no such endpoint" }).send("I'm sorry, There is no such endpoint");
})

app.listen(port, (): void => {
    console.log(`starting app on: ${address}`);
});

export default app;