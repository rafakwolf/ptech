import {Express, RequestHandler, Request, Response, NextFunction} from 'express';
import { UserController } from './src/controllers/UserController';
import { ItemController } from './src/controllers/ItemController';
import { GroupController } from './src/controllers/GroupController';
import { authMiddleware } from './src/middleware/auth';

function awaitFunction(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export class Routes {
  public users: UserController = new UserController();
  public items: ItemController = new ItemController();
  public groups: GroupController = new GroupController();

  public registerRoutes(app: Express): void {
    this.registerUserRoutes(app);
    this.registerItemRoutes(app);
    this.registerGroupRoutes(app);  
  }

  /**
   * @swagger
   * definitions:
   *   User:
   *     properties:
   *       email:
   *         type: string
   *       password:
   *         type: string
   */  
  registerUserRoutes(app: Express) {
    /**
     * @swagger
     * /register:
     *   post:
     *     tags:
     *       - Register
     *     description: Register a new user
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Registered user
     *         schema:
     *           $ref: '#/definitions/User' 
     */    
    app.route("/register").post(this.users.register);

    /**
     * @swagger
     * /login:
     *   post:
     *     tags:
     *       - Login
     *     description: Login
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Authentication token
     *         schema:
     *           $ref: '#/definitions/User' 
     */     
    app.route("/login").post(awaitFunction(this.users.login));
    app.route("/reset-password").post(awaitFunction(this.users.resetPassword));
    app.route("/reset-password-confirm").post(awaitFunction(this.users.resetPasswordConfirm));
  } 

  registerItemRoutes(app: Express) {
    app.route("/items").get([authMiddleware(), awaitFunction(this.items.getAll)]);
    app.route("/items/:id").get([authMiddleware(), awaitFunction(this.items.getById)]);
    app.route("/items").post([authMiddleware(), awaitFunction(this.items.create)]);
    app.route("/items/:id").put([authMiddleware(), awaitFunction(this.items.update)]);
    app.route("/items/:id").delete([authMiddleware(), awaitFunction(this.items.remove)]);
  }

  registerGroupRoutes(app: Express) {
    app.route("/groups").get([authMiddleware(), awaitFunction(this.groups.getAll)]);
    app.route("/groups/:id").get([authMiddleware(), awaitFunction(this.groups.getById)]);
    app.route("/groups").post([authMiddleware(), awaitFunction(this.groups.create)]);
    app.route("/groups/:id").put([authMiddleware(), awaitFunction(this.groups.update)]);
    app.route("/groups/:id").delete([authMiddleware(), awaitFunction(this.groups.remove)]);
  }  
}