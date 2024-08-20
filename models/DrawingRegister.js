import { model, Schema } from "mongoose";


/**
 * @swagger
 * components:
 *   schemas:
 *     Register:
 *       type: object
 *       properties:
 *         projectNumber:
 *           type: number
 *           description: Project number associated with the register entry.
 *         projectName:
 *           type: string
 *           description: Project name .
 *         projectDescipline:
 *           type: string
 *           description: Discipline of the project associated with the register entry.
 *         projectEngineers:
 *           type: array
 *           items:
 *             type: string
 *           description: List of engineers involved in the project associated with the register entry.
 *         commencementDate:
 *           type: string
 *           format: date
 *           description: Date when the project associated with the register entry commenced.
 *         completionDate:
 *           type: string
 *           format: date
 *           description: Date when the project associated with the register entry was completed.
 *         categories:
 *           type: array
 *           items:
 *             type: String
 *           description: ID of the category to which the register entry belongs.
 *       required:
 *         - projectNumber
 *         - projectDescipline
 *         - commencementDate
 *         - completionDate
 *         - categories
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the category.
 *         description:
 *           type: string
 *           description: Description of the category.
 *       required:
 *         - title
 *         - description
 */

const categorySchema = new Schema({
    title: String,
    description: String,
    drawings: [{ type: Schema.Types.ObjectId, ref: "Drawing" }],
})

/**
 * @swagger
 * components:
 *   schemas:
 *     Drawing:
 *       type: object
 *       properties:
 *         drawingNumber:
 *           type: string
 *           description: Unique identifier for the drawing.
 *         projectNumber:
 *           type: string
 *           description: Project number associated with the drawing.
 *         description:
 *           type: string
 *           description: Description of the drawing.
 *         title:
 *           type: string
 *           description: Title of the drawing.
 *         size:
 *           type: string
 *           description: Size of the drawing.
 *         revisions:
 *           type: number
 *           description: Number of revisions made to the drawing.
 *           default: 0
 *       required:
 *         - drawingNumber
 *         - projectNumber
 *         - description
 *         - title
 *         - size
 */

const drawingSchema = new Schema({
    drawingNumber: String,
    projectNumber: String,   // this is the projectnumber associated with the drawing
    description: String,
    title: String,
    size: String,
    revisions: { type: Number, default: 0 }
});

const registerSchema = new Schema({
    projectName: String,
    projectNumber: Number,
    projectDescipline: String,
    projectEngineers: [String],
    commencementDate: Date,
    completionDate: Date,
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }]
});



export const Register = model('Register', registerSchema);
export const Category = model('Category', categorySchema);
export const Drawing = model('Drawing', drawingSchema);