import express from "express";
import cors from 'cors';
import { Routes } from "./routes";
import { createConnection } from "typeorm";

class App {
  public app: express.Express;
  public routes: Routes = new Routes();

  constructor() {
    this.app = express();
    createConnection().then(() => {
      this.config();
      this.routes.registerRoutes(this.app);  
    }).catch(error => {
      console.error(error);
    });
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
  }
}

export default new App().app;