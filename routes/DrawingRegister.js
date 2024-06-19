import { Router } from "express";
import { Category, Drawing, Register } from "../models/DrawingRegister.js";


const router = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: add  a new record in the  register entry
 *     description: Creates a new register entry with the provided data.
 *     tags:
 *       - Drawing Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectNumber:
 *                 type: number
 *               projectName:
 *                 type: string
 *               projectDescipline:
 *                 type: string
 *               projectEngineers:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: ID of the category to which the register belongs
 *               commencementDate:
 *                 type: string
 *                 format: date
 *               completionDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       '201':
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       '400':
 *         description: Bad request. The provided data is invalid.
 */
router.post('/', async (req, res) => {
    try {
        // First, save the categories in the database
        if (req.body.categories) {
            const categoryIds = [];
            for (const categoryData of req.body.categories) {
                const category = await Category.create({ title: categoryData });
                categoryIds.push(category._id);
            }

            // Then, create the register entry with the category IDs
            const registerData = { ...req.body, categories: categoryIds };
            const register = await Register.create(registerData);
            return res.status(201).json(register);

        } else {
            const registerData = { ...req.body };
            const register = await Register.create(registerData);
            return res.status(201).json(register);
        }



    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Retrieve all drawings from the register entries
 *     description: Retrieves a list of all register entries.
 *     tags:
 *       - Drawing Register
 *     responses:
 *       '200':
 *         description: A list of register entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Register'
 *       '500':
 *         description: Internal server error. Failed to retrieve register entries.
 */


router.get('/', async (req, res) => {
    try {
        const registers = await Register.find()
            .populate([
                {
                    path: "categories",
                    populate: {
                        path: "drawings"
                    },
                    options: { strictPopulate: false },
                }
            ]);
        res.json(registers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /register/{id}:
 *   get:
 *     summary: Retrieve a register entry by ID
 *     description: Retrieves a single register entry by its ID.
 *     tags:
 *       - Drawing Register
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the register entry to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The register entry.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       '404':
 *         description: Register entry not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Register not found
 *       '500':
 *         description: Internal server error. Failed to retrieve register entry.
 */

router.get('/:id', async (req, res) => {
    try {
        const register = await Register.findById(req.params.id).populate({
            path: "categories",

            populate: {
                path: "drawings"
            }

        });
        if (!register) {
            return res.status(404).json({ message: 'Register not found' });
        }
        res.json(register);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /register/{id}:
 *   put:
 *     summary: Update a register entry by ID
 *     description: Updates an existing register entry with the provided data. If an array of categories is provided in the request body, it first saves them in the Category database before updating the register's categories array.
 *     tags:
 *       - Drawing Register
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the register entry to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectNumber:
 *                 type: number
 *               projectDescipline:
 *                 type: string
 *               projectEngineers:
 *                 type: array
 *                 items:
 *                   type: string
 *               commencementDate:
 *                 type: string
 *                 format: date
 *               completionDate:
 *                 type: string
 *                 format: date
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: The updated register entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       '404':
 *         description: Register entry not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request. Failed to update the register entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.put('/:id', async (req, res) => {
    try {
        const { categories, ...updatedData } = req.body;

        let categoryIds = [];
        // If categories are provided in the request body, save them in the Category database
        if (categories && categories.length > 0) {

            for (const categoryData of categories) {
                const category = await Category.create({ title: categoryData });
                // console.log(category)
                categoryIds.push(category._id.toString());
            }
            // updatedData.categories = categoryIds;
        }

        // console.log(categoryIds)

        // Update the register entry with the updated data
        const register = await Register.findById(req.params.id);
        // console.log(register.categories)
        updatedData.categories = [...categoryIds, ...register.categories];

        console.log(updatedData)

        // saving into the database
        const registerUpdate = await Register.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!registerUpdate) {
            return res.status(404).json({ message: 'Register not found' });
        }

        return res.json(registerUpdate);




        if (!register) {
            return res.status(404).json({ message: 'Register not found' });
        }

        res.json(register);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


/**
 * @swagger
 * /register/{registerId}/categories:
 *   post:
 *     summary: Add categories to a register
 *     description: Adds new categories to a register by register ID. First saves the categories in the Category database and then populates the register's categories array.
 *     tags:
 *       - Drawing Register
 *     parameters:
 *       - in: path
 *         name: registerId
 *         required: true
 *         description: ID of the register to which categories will be added
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items: 
 *               $ref: '#/components/schemas/Category'
 *     responses:
 *       '200':
 *         description: Successfully added categories to the register
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Register'
 *       '400':
 *         description: Bad request. Failed to add categories to the register.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.post('/:registerId/categories', async (req, res) => {
    try {
        const { registerId } = req.params;
        const categoryData = req.body;

        // console.log(req.body)
        // console.log(req.params)

        // First, save the categories in the Category database
        const createdCategories = await Category.create(categoryData);



        // Find the register by ID
        const register = await Register.findById(registerId);
        if (!register) {
            return res.status(404).json({ message: 'Register not found' });
        }

        console.log(createdCategories);

        // // Update the register with the new categories
        register.categories.push(...createdCategories.map(category => category._id));
        await register.save();

        res.status(200).json(register);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /register/{registerId}/categories/{categoryId}:
 *   delete:
 *     summary: Delete a category from a register
 *     description: Delete a category from a register by register ID and category ID. Removes the category from the register's categories array and also deletes the category from the Category collection.
 *     tags:
 *       - Drawing Register
 *     parameters:
 *       - in: path
 *         name: registerId
 *         required: true
 *         description: ID of the register from which the category will be deleted.
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted the category from the register
 *       '404':
 *         description: Register or category not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:registerId/categories/:categoryId', async (req, res) => {
    try {
        const { registerId, categoryId } = req.params;

        // Find the register by ID
        const register = await Register.findById(registerId);
        if (!register) {
            return res.status(404).json({ message: 'Register not found' });
        }

        // Check if the category exists in the register's categories array
        if (!register.categories.includes(categoryId)) {
            return res.status(404).json({ message: 'Category not found in the register' });
        }

        // Remove the category from the register's categories array
        register.categories = register.categories.filter(cat => cat.toString() !== categoryId);
        await register.save();

        // Delete the category from the Category collection
        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({ message: 'Category deleted from register successfully' });
    } catch (error) {
        console.error('Error deleting category from register:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



/**
 * @swagger
 * /register/{id}:
 *   delete:
 *     summary: Delete a register entry by ID
 *     description: Deletes an existing register entry by its ID.
 *     tags:
 *       - Drawing Register
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the register entry to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Register entry deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Register deleted successfully
 *       '404':
 *         description: Register entry not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Register not found
 *       '500':
 *         description: Internal server error. Failed to delete register entry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.delete('/:id', async (req, res) => {
    try {
        const register = await Register.findByIdAndDelete(req.params.id);
        if (!register) {
            return res.status(404).json({ message: 'Register not found' });
        }
        res.json({ message: 'Register deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /register/drawings/{id}:
 *   get:
 *     summary: Get a drawing by ID
 *     description: Retrieves a drawing by its ID.
 *     tags:
 *       - Drawing Register
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the drawing to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the drawing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Drawing'
 *       '400':
 *         description: Bad request. Failed to retrieve the drawing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.get('/drawings/:id', async (req, res) => {
    const { id } = req.params;


    try {
        const drawing = await Drawing.findById(id);
        res.send(drawing)
    } catch (error) {
        res.status(400).send(error)
    }

})





















export default router;
