import { Router } from 'express';
import UserController from '../controllers/UserController';
import ContactController from '../controllers/ContactController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Default API response
router.get('/', (req, res) => {
  res.json({
    status: 'API is working',
    message: 'Welcome to the Contact Management API!'
  });
});

// User routes
router.route('/users')
  .get(authMiddleware, UserController.getAllUsers)
  .post(UserController.createUser);

router.route('/user/:user_id')
  .get(authMiddleware, UserController.getUserById)
  .put(authMiddleware, UserController.updateUser)
  .delete(authMiddleware, UserController.deleteUser);

router.route('/user/changepassword/:user_id')
  .put(authMiddleware, UserController.changePassword);

/**
 * @swagger
 * /api/user/authenticate:
 *   post:
 *     summary: Authenticate a user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful
 */
router.route('/user/authenticate')
  .post(UserController.authenticate);

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 */
router.route('/contacts')
  .get(authMiddleware, ContactController.getAllContacts)
  .post(authMiddleware, ContactController.createContact);

/**
 * @swagger
 * /api/contact/{contact_id}:
 *   get:
 *     summary: Get contact by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contact_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *       404:
 *         description: Contact not found
 */
router.route('/contact/:contact_id')
  .get(authMiddleware, ContactController.getContactById)
  .put(authMiddleware, ContactController.updateContact)
  .delete(authMiddleware, ContactController.deleteContact);

export default router;