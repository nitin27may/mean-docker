// Filename: api-routes.js
// Initialize express router
let router = require("express").Router();
var { expressjwt: jwt } = require("express-jwt");
const environment = require("./config/environment");

const jwtAuth = jwt({ secret: environment.secret, algorithms: ["HS256"] });

// Set default API response
router.get("/", function (req, res) {
  res.json({
    status: "API Its Working",
    message: "Welcome to RESTHub crafted with love!"
  });
});

// Import user controller
var userController = require("./controllers/users.controller");

// user routes
router
  .route("/users")
  .get(jwtAuth, userController.index)
  .post(userController.new);
router
  .route("/user/:user_id")
  .get(jwtAuth, userController.view)
  .patch(jwtAuth, userController.update)
  .put(jwtAuth, userController.update)
  .delete(jwtAuth, userController.delete);
router
  .route("/user/changepassword/:user_id")
  .put(jwtAuth, userController.changePassword);
// Public route for user authentication (without jwtAuth)
router.route("/user/authenticate").post(userController.authenticate);

// Import Contact controller
var contactController = require("./controllers/contact.controller");

// Contact routes
router
  .route("/contacts")
  .get(jwtAuth, contactController.index)
  .post(jwtAuth, contactController.new);
router
  .route("/contact/:contact_id")
  .get(jwtAuth, contactController.view)
  .patch(jwtAuth, contactController.update)
  .put(jwtAuth, contactController.update)
  .delete(jwtAuth, contactController.delete);

// Export API routes
module.exports = router;
