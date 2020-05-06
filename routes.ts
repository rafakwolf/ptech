import {Express} from 'express';
import { UserController } from './src/controllers/UserController';
import { ItemController } from './src/controllers/ItemController';
import { GroupController } from './src/controllers/GroupController';

export class Routes {
  public users: UserController = new UserController();
  public items: ItemController = new ItemController();
  public groups: GroupController = new GroupController();

  public registerRoutes(app: Express): void {
    this.registerUserRoutes(app);
    this.registerItemRoutes(app);
    this.registerGroupRoutes(app);
  }

  registerUserRoutes(app: Express) {
    app.route("/register").post(this.users.register);
    app.route("/login").post(this.users.login);
    app.route("/reset-password").post(this.users.resetPassword);
  } 

  registerItemRoutes(app: Express) {
    app.route("/items").get(this.items.getAll);
    app.route("/items/:id").get(this.items.getById);
    app.route("/items").post(this.items.create);
    app.route("/items/:id").put(this.items.update);
    app.route("/items").delete(this.items.remove);
  }

  registerGroupRoutes(app: Express) {
    app.route("/groups").get(this.groups.getAll);
    app.route("/groups/:id").get(this.groups.getById);
    app.route("/groups").post(this.groups.create);
    app.route("/groups/:id").put(this.groups.update);
    app.route("/groups").delete(this.groups.remove);
  }  
}