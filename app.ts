import express from "express";
import cors from 'cors';
import { Routes } from "./routes";
import { createConnection } from "typeorm";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

class App {
  public app: express.Express;
  public routes: Routes = new Routes();

  constructor() {
    this.app = express();    
    this.config();
    this.routes.registerRoutes(this.app);
    this.swaggerDefs();

    this.app.locals['routes'] = this.routes;

    createConnection();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
  }

  private swaggerDefs() {
    const swaggerDefinition = {
      info: {
        title: 'PTech API',
        version: '1.0.0',
        description: 'PTech Rest Api',
      },
      host: 'localhost:3000',
      basePath: '/',
    };

    const options = {
      swaggerDefinition: swaggerDefinition,
      apis: [path.join(__dirname, 'dist', 'routes.js')],
    };

    const swaggerSpec = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
}

export default new App().app;