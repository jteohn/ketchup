const cors = require("cors");
const express = require("express");
require("dotenv").config();

// Import middlewares
const jwtAuth = require("./middlewares/jwtAuth");

// importing routers
const UserProfileRouter = require("./routers/userProfileRouter");
const AuthRouter = require("./routers/authRouter");
const InvitationRouter = require("./routers/invitationRouter");
const HomeRouter = require("./routers/homeRouter");
const AdminRouter = require("./routers/adminRouter");

// importing Controllers
const UserProfileController = require("./controllers/userProfileController");
const AuthController = require("./controllers/authController");
const InvitationController = require("./controllers/invitationController");
const HomeController = require("./controllers/homeController");
const AdminController = require("./controllers/adminController");

// importing DB
const db = require("./db/models/index");
const {
  user,
  organisation,
  invitation,
  organisation_admin,
  // priority,
  flag,
  reaction,
  // tag,
  ticket,
  // ticket_dependency,
  document,
  // document_ticket,
  watcher,
  post,
  post_reaction,
  ketchup,
  ketchup_reaction,
  agenda,
  ketchup_agenda,
  update,
  ketchup_update,
  // notification,
} = db;

// initialising controllers -> note the lowercase for the first word
const userProfileController = new UserProfileController({
  user,
  organisation,
  ticket,
  document,
  watcher,
});

const authController = new AuthController({
  user,
  organisation,
  invitation,
  organisation_admin,
});

const adminController = new AdminController({
  user,
  invitation,
  organisation,
  organisation_admin,
});

const invitationController = new InvitationController({
  user,
  invitation,
  organisation,
  organisation_admin,
});

const homeController = new HomeController({
  user,
  organisation,
  flag,
  reaction,
  ticket,
  document,
  post,
  post_reaction,
  ketchup,
  ketchup_reaction,
  agenda,
  ketchup_agenda,
  update,
  ketchup_update,
});

// initialising routers
//TODO: rmb to pass jwtAuth in protected routes
const userProfileRouter = new UserProfileRouter(
  userProfileController,
  jwtAuth
).routes();

const authRouter = new AuthRouter(authController).routes();
const adminRouter = new AdminRouter(adminController).routes();
const invitationRouter = new InvitationRouter(invitationController).routes();
const homeRouter = new HomeRouter(homeController).routes();

const PORT = process.env.PORT;
const app = express();

// enable CORS access to this server
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// using the routers
app.use("/users", userProfileRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/invite", invitationRouter);
app.use("/home", homeRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
