import express from 'express';
import { IssueSheet } from '../models/IssueSheet.js'; // Assuming this is the correct path to your model
import { nextIssueSheetNumber } from '../util/nextIssueSheetNumber.js';

const router = express.Router();

/**
 * @swagger
 * /issue-sheets:
 *   post:
 *     summary: Create an issue sheet
 *     description: Creates a new issue sheet.
 *     tags:
 *       - Issue Sheets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IssueSheet'
 *     responses:
 *       '201':
 *         description: Issue sheet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IssueSheet'
 *       '400':
 *         description: Bad request. Failed to create issue sheet.
 *       '500':
 *         description: Internal server error.
 */
router.post('/', async (req, res) => {
    try {
        const issueSheetData = req.body;
        issueSheetData.issueSheetNumber = await nextIssueSheetNumber();

        // console.log(issueSheetData)
        const createdIssueSheet = await IssueSheet.create(issueSheetData);
        res.status(201).json(createdIssueSheet);
    } catch (error) {
        console.error('Error creating issue sheet:', error);
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /issue-sheets:
 *   get:
 *     summary: Get all issue sheets
 *     description: Retrieves a list of all issue sheets.
 *     tags:
 *       - Issue Sheets
 *     responses:
 *       '200':
 *         description: Successfully retrieved issue sheets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IssueSheet'
 *       '500':
 *         description: Internal server error.
 */
router.get('/', async (req, res) => {
    try {
        const issueSheets = await IssueSheet.find().populate([
            {
                path: "drawingsIssued.drawing"
            }
        ]);
        res.status(200).json(issueSheets);
    } catch (error) {
        console.error('Error fetching issue sheets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /issue-sheets/{id}:
 *   get:
 *     summary: Get an issue sheet by ID
 *     description: Retrieves an issue sheet by its ID.
 *     tags:
 *       - Issue Sheets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the issue sheet to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the issue sheet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IssueSheet'
 *       '404':
 *         description: Issue sheet not found.
 *       '500':
 *         description: Internal server error.
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const issueSheet = await IssueSheet.findById(id).populate([
            {
                path: "drawingsIssued.drawing"
            },
        ]);
        if (!issueSheet) {
            return res.status(404).json({ message: 'Issue sheet not found' });
        }
        res.status(200).json(issueSheet);
    } catch (error) {
        console.error('Error fetching issue sheet by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /issue-sheets/{id}:
 *   put:
 *     summary: Update an issue sheet by ID
 *     description: Updates an issue sheet with new data.
 *     tags:
 *       - Issue Sheets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the issue sheet to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IssueSheet'
 *     responses:
 *       '200':
 *         description: Issue sheet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IssueSheet'
 *       '404':
 *         description: Issue sheet not found.
 *       '500':
 *         description: Internal server error.
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedIssueSheet = await IssueSheet.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedIssueSheet) {
            return res.status(404).json({ message: 'Issue sheet not found' });
        }
        res.status(200).json(updatedIssueSheet);
    } catch (error) {
        console.error('Error updating issue sheet by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /issue-sheets/{id}:
 *   delete:
 *     summary: Delete an issue sheet by ID
 *     description: Deletes an issue sheet by its ID.
 *     tags:
 *       - Issue Sheets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the issue sheet to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Issue sheet deleted successfully
 *       '404':
 *         description: Issue sheet not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedIssueSheet = await IssueSheet.findByIdAndDelete(id);
        if (!deletedIssueSheet) {
            return res.status(404).json({ message: 'Issue sheet not found' });
        }
        res.status(200).json({ message: 'Issue sheet deleted successfully' });
    } catch (error) {
        console.error('Error deleting issue sheet by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
* @swagger
* tags:
*   name: Issue Sheets
*   description: API endpoints for managing issue sheets and drawings.
*/




/**
 * @swagger
 * /issue-sheets/{issueSheetId}/addDrawing:
 *   post:
 *     summary: Add a drawing to the list of issued drawings for an issue sheet.
 *     tags: [Issue Sheets]
 *     parameters:
 *       - in: path
 *         name: issueSheetId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the issue sheet to which the drawing will be added.
 *       - in: body
 *         name: drawing
 *         schema:
 *           type: object
 *           properties:
 *             drawing:
 *               type: string
 *               description: ID of the drawing to be added.
 *             copies:
 *               type: number
 *               description: Number of copies of the drawing.
 *         required: true
 *         description: Object containing the drawing details.
 *     responses:
 *       201:
 *         description: Drawing added successfully.
 *       404:
 *         description: Issue sheet not found.
 *       500:
 *         description: Server error.
 */

// Route to add a drawing to the list of issued drawings
router.post('/:issueSheetId/addDrawing', async (req, res) => {
    const { issueSheetId } = req.params;
    const { drawing, copies } = req.body;

    try {
        const issueSheet = await IssueSheet.findById(issueSheetId);

        if (!issueSheet) {
            return res.status(404).json({ error: 'Issue sheet not found' });
        }

        // Check if the drawing already exists in the drawingsIssued array
        const existingDrawingIndex = issueSheet.drawingsIssued.findIndex(d => d.drawing.toString() === drawing);

        if (existingDrawingIndex !== -1) {
            // If the drawing exists, increment the number of copies
            issueSheet.drawingsIssued[existingDrawingIndex].copies += copies;
        } else {
            // If the drawing doesn't exist, add it to the drawingsIssued array
            issueSheet.drawingsIssued.push({ drawing, copies });
        }

        await issueSheet.save();

        res.status(201).json({ message: 'Drawing added successfully', issueSheet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});



/**
* @swagger
* /issue-sheets/{issueSheetId}/removeDrawing/{drawingId}:
*   delete:
*     summary: Remove a drawing from the list of issued drawings for an issue sheet.
*     tags: [Issue Sheets]
*     parameters:
*       - in: path
*         name: issueSheetId
*         schema:
*           type: string
*         required: true
*         description: ID of the issue sheet from which the drawing will be removed.
*       - in: path
*         name: drawingId
*         schema:
*           type: string
*         required: true
*         description: ID of the drawing to be removed.
*     responses:
*       200:
*         description: Drawing removed successfully.
*       404:
*         description: Issue sheet or drawing not found.
*       500:
*         description: Server error.
*/
// Route to delete a drawing from the list of issued drawings
router.delete('/:issueSheetId/removeDrawing/:drawingId', async (req, res) => {
    const { issueSheetId, drawingId } = req.params;

    try {
        const issueSheet = await IssueSheet.findById(issueSheetId);

        if (!issueSheet) {
            return res.status(404).json({ error: 'Issue sheet not found' });
        }

        // Find the index of the drawing to be removed
        const drawingIndex = issueSheet.drawingsIssued.findIndex(d => d._id === drawingId);

        if (drawingIndex === -1) {
            return res.status(404).json({ error: 'Drawing not found in the issue sheet' });
        }

        // Remove the drawing from the drawingsIssued array
        issueSheet.drawingsIssued.splice(drawingIndex, 1);
        await issueSheet.save();

        res.json({ message: 'Drawing removed successfully', issueSheet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


export default router;
