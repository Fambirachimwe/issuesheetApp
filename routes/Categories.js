/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 */

import express from 'express';
import { Category, Drawing, Register } from '../models/DrawingRegister.js'; // Assuming models are in a separate file

const router = express.Router();

//  the post request is being handled by the  post /register request

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories
 *     tags: [Categories]
 *     responses:
 *       '200':
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       '500':
 *         description: Internal server error. Failed to retrieve categories.
 */
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().populate([
            {
                path: "drawings",
                // populate: {
                //     path: 'drawings'
                // }
            }
        ]);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retrieve a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '404':
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate([
            {
                path: "drawings"
            }
        ]);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error. Failed to delete the category.
 */
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id).populate([
            {
                path: "drawings"
            }
        ]);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



/**
 * @swagger
 * /categories/{categoryId}/add-drawing:
 *   post:
 *     summary: Add a drawing to a category.
 *     description: Add a new drawing to a category by its ID. First, saves the drawing into the Drawing collection, then populates the drawing's ID in the category's drawings array.
 *     tags: 
 *         - Categories
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category to which the drawing will be added.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *             drawingNumber:
 *               type: string
 *               description: The number of the drawing.
 *             description:
 *               type: string
 *               description: Description of the drawing.
 *             title:
 *               type: string
 *               description: Title of the drawing.
 *             size:
 *               type: string
 *               description: Size of the drawing.
 *             revisions:
 *               type: number
 *               description: List of revision numbers for the drawing.
 *     responses:
 *       200:
 *         description: Drawing added to category successfully.
 *       400:
 *         description: Bad request. Invalid input data.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/:categoryId/add-drawing", async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { drawingNumber, description, title, size, revisions } = req.body;

        // console.log(req.body)

        // Create the drawing in the Drawing collection
        const newDrawing = new Drawing({
            drawingNumber,
            description,
            title,
            size,
            revisions
        });
        const savedDrawing = await newDrawing.save();

        // Update the category to add the drawing
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Add the drawing id to the category's drawings array
        category.drawings.push(savedDrawing._id);
        await category.save();

        res.status(200).json({ message: "Drawing added to category successfully", category });
    } catch (error) {
        console.error("Error adding drawing to category:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


/**
 * @swagger
 * /categories/{categoryId}/delete-drawing/{drawingId}:
 *   delete:
 *     summary: Delete a drawing from a category.
 *     description: Delete a drawing from a category by its ID.
 *     tags: 
 *         - Categories
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category from which the drawing will be deleted.
 *         schema:
 *           type: string
 *       - in: path
 *         name: drawingId
 *         required: true
 *         description: ID of the drawing to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drawing deleted from category successfully.
 *       404:
 *         description: Category or drawing not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:categoryId/delete-drawing/:drawingId", async (req, res) => {
    try {
        const { categoryId, drawingId } = req.params;

        // Find the category
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if the drawing exists in the category
        if (!category.drawings.includes(drawingId)) {
            return res.status(404).json({ message: "Drawing not found in the category" });
        }

        // Remove the drawing from the category's drawings array
        category.drawings = category.drawings.filter(draw => draw.toString() !== drawingId);
        await category.save();

        // Delete the drawing from the Drawing collection
        await Drawing.findByIdAndDelete(drawingId);

        res.status(200).json({ message: "Drawing deleted from category successfully" });
    } catch (error) {
        console.error("Error deleting drawing from category:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


/**
 * @swagger
 * /categories/{categoryId}:
 *   put:
 *     summary: Update a category by ID
 *     description: Update the details of a category by its ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '404':
 *         description: Category not found.
 *       '500':
 *         description: Internal server error.
 */
router.put('/categories/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const updateData = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



/**
 * @swagger
 * /categories/drawings/{projectNumber}:
 *   get:
 *     summary: Get all drawings for a given project number.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: projectNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Project number associated with the drawings.
 *     responses:
 *       '200':
 *         description: A list of drawings for the specified project number.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Drawing'
 *       '404':
 *         description: No drawings found for the provided project number.
 */

router.get('/drawings/:projectNumber', async (req, res) => {
    const { projectNumber } = req.params;

    // Fetch all drawings for the given project number
    const register = await Register.find({ projectNumber }).populate({
        path: 'categories',
        populate: {
            path: 'drawings'
        }

    });

    // console.log(register)

    // Extract drawing from the categories
    const allDrawings = [];
    register.forEach(register => {
        register.categories.forEach(category => {
            allDrawings.push(...category.drawings);
        });
    });

    res.send(allDrawings);
});


export default router