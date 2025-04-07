import { Request, Response } from 'express';
import Contact, { IContact } from '../models/contact';

export class ContactController {
  /**
   * @swagger
   * /api/contacts:
   *   get:
   *     summary: Get all contacts
   *     tags: [Contacts]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of contacts
   *       400:
   *         description: Bad request
   */
  public async getAllContacts(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await Contact.find();
      
      res.json({
        status: 'success',
        message: 'Contacts retrieved successfully',
        data: contacts
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error
      });
    }
  }

  /**
   * @swagger
   * /api/contacts:
   *   post:
   *     summary: Create a new contact
   *     tags: [Contacts]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *               - mobile
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               mobile:
   *                 type: string
   *               email:
   *                 type: string
   *               city:
   *                 type: string
   *               postalCode:
   *                 type: string
   *     responses:
   *       200:
   *         description: Contact created successfully
   *       400:
   *         description: Mobile number already exists or invalid data
   */
  public async createContact(req: Request, res: Response): Promise<void> {
    try {
      // Check if contact with same mobile already exists
      const existingContact = await Contact.findOne({ mobile: req.body.mobile.trim() });
      
      if (existingContact) {
        res.status(400).json({
          status: 'error',
          message: `Contact with mobile ${req.body.mobile} already exists`
        });
        return;
      }
      
      // Create new contact
      const contact = new Contact(req.body);
      
      // Save contact
      await contact.save();
      
      res.json({
        message: 'New contact created!',
        data: contact
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
   * /api/contact/{id}:
   *   get:
   *     summary: Get contact by ID
   *     tags: [Contacts]
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
   *         description: Contact details
   *       400:
   *         description: Bad request
   */
  public async getContactById(req: Request, res: Response): Promise<void> {
    try {
      const contact = await Contact.findById(req.params.contact_id);
      
      if (!contact) {
        res.status(404).json({
          status: 'error',
          message: 'Contact not found'
        });
        return;
      }
      
      res.json({
        message: 'Contact details loading..',
        data: contact
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
   * /api/contact/{id}:
   *   put:
   *     summary: Update contact
   *     tags: [Contacts]
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
   *               mobile:
   *                 type: string
   *               email:
   *                 type: string
   *               city:
   *                 type: string
   *               postalCode:
   *                 type: string
   *     responses:
   *       200:
   *         description: Contact updated successfully
   *       400:
   *         description: Bad request
   */
  public async updateContact(req: Request, res: Response): Promise<void> {
    try {
      const contact = await Contact.findByIdAndUpdate(
        req.params.contact_id,
        req.body,
        { new: true }
      );
      
      if (!contact) {
        res.status(404).json({
          status: 'error',
          message: 'Contact not found'
        });
        return;
      }
      
      res.json({
        message: 'Contact Info updated',
        data: contact
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
   * /api/contact/{id}:
   *   delete:
   *     summary: Delete contact
   *     tags: [Contacts]
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
   *         description: Contact deleted successfully
   *       400:
   *         description: Bad request
   */
  public async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      await Contact.findByIdAndDelete(req.params.contact_id);
      
      res.json({
        status: 'success',
        message: 'Contact deleted'
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        error
      });
    }
  }
}

export default new ContactController();