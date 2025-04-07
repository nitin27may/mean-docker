import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import env from '../config/env';

// Add these interfaces at the top of the file
interface UserDocument {
  _id: string;
  email: string;
  password: string;
  // ...other user properties
}

type UserResponse = Omit<UserDocument, 'password'>;

export class UserController {
  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of users
   *       400:
   *         description: Bad request
   */
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find().select('-password');
      
      res.json({
        status: 'success',
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        error: 'Bad Request'
      });
    }
  }

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *               - username
   *               - password
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User created successfully
   *       400:
   *         description: Username already exists or invalid data
   */
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, firstName, lastName, password } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ username: username.trim() });
      
      if (existingUser) {
        res.status(400).json({
          status: 'error',
          message: `${username} is already taken`
        });
        return;
      }
      
      // Create new user
      const newUser = new User({
        username,
        firstName,
        lastName,
        email: username, // Using username as email
        password: await bcrypt.hash(password, 10)
      });
      
      // Save user
      await newUser.save();
      
      // Create user response without password
      const userResponse: UserResponse = {
        ...newUser.toObject(),
        password: undefined
      } as UserResponse;
      
      res.json({
        message: 'New user created!',
        data: userResponse
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        error
      });
    }
  }

  /**
   * @swagger
   * /api/user/{id}:
   *   get:
   *     summary: Get user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User details
   *       400:
   *         description: Bad request
   */
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.params.user_id).select('-password');
      
      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
        return;
      }
      
      res.json({
        message: 'User details loading..',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        error
      });
    }
  }

  /**
   * @swagger
   * /api/user/{id}:
   *   put:
   *     summary: Update user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *               mobile:
   *                 type: string
   *     responses:
   *       200:
   *         description: User updated successfully
   *       400:
   *         description: Bad request
   */
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.user_id,
        req.body,
        { new: true }
      ).select('-password');
      
      if (!updatedUser) {
        res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
        return;
      }
      
      res.json({
        message: 'User Info updated',
        data: updatedUser
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        error
      });
    }
  }

  /**
   * @swagger
   * /api/user/{id}:
   *   delete:
   *     summary: Delete user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       400:
   *         description: Bad request
   */
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      await User.findByIdAndDelete(req.params.user_id);
      
      res.json({
        status: 'success',
        message: 'User deleted'
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        error
      });
    }
  }

  /**
   * @swagger
   * /api/user/authenticate:
   *   post:
   *     summary: Authenticate user (login)
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  public async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      
      // Find user
      const user = await User.findOne({ username });
      
      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'User name or password is invalid.'
        });
        return;
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        res.status(401).json({
          status: 'error',
          message: 'User name or password is invalid.'
        });
        return;
      }
      
      // Generate token
      const token = jwt.sign({ sub: user._id }, env.secret, {
        algorithm: 'HS256'
      });
      user.token = token;
      // Create user response without password
      const userResponse: UserResponse = {
        ...user.toObject(),
        password: undefined
      } as UserResponse;
      
      res.json({
        status: 'success',
        message: 'Authentication successful',
        token: token,
        data: userResponse
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        error
      });
    }
  }

  /**
   * @swagger
   * /api/user/changepassword/{id}:
   *   put:
   *     summary: Change user password
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - password
   *             properties:
   *               password:
   *                 type: string
   *     responses:
   *       202:
   *         description: Password updated successfully
   *       401:
   *         description: Old password is wrong
   */
  public async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { password } = req.body;
      const user = await User.findById(req.params.user_id);
      
      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
        return;
      }
      
      // Hash new password
      user.password = await bcrypt.hash(password, 10);
      
      // Save user
      await user.save();
      
      res.status(202).json({
        status: 'success',
        message: 'Password Updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        error
      });
    }
  }
}

export default new UserController();