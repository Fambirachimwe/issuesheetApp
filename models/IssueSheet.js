import { model, Schema } from "mongoose";
import { nextIssueSheetNumber } from "../util/nextIssueSheetNumber.js";


/**
 * @swagger
 * components:
 *   schemas:
 *     IssueSheet:
 *       type: object
 *       properties:

 *         to:
 *           type: string
 *           description: Recipient of the issue sheet.
 *         attention:
 *           type: string
 *           description: Attention to a specific person or department.
 *         client:
 *           type: string
 *           description: Client associated with the issue sheet.
 *         projectName:
 *           type: string
 *           description: Name of the project associated with the issue sheet.
 *         projectNumber:
 *           type: number
 *           description: Number of the project associated with the issue sheet.
 *         drawingsIssued:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               drawing:
 *                 type: string
 *                 description: ID of the drawing referenced in the issue sheet.
 *               copies:
 *                 type: number
 *                 description: Number of copies issued.
 *           description: List of drawings issued with their corresponding number of copies.
 *         remarks:
 *           type: string
 *           description: Remarks or additional information related to the issue sheet.
 *         issuedFor:
 *           type: string
 *           description: Purpose or intended use of the issued drawings.
 *         media:
 *           type: string
 *           enum: [electronic, physical]
 *           description: Media through which the drawings are issued (electronic or physical).
 *         issuedBy:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Name of the person issuing the drawings.
 *             signature:
 *               type: string
 *               description: Signature of the person issuing the drawings.
 *             date:
 *               type: string
 *               format: date-time
 *               description: Date when the drawings are issued.
 *         receiveBy:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Name of the person receiving the drawings.
 *             signature:
 *               type: string
 *               description: Signature of the person receiving the drawings.
 *             date:
 *               type: string
 *               format: date-time
 *               description: Date when the drawings are received.
 *       required:
 *         - issueSheetNumber
 *         - to
 *         - client
 *         - projectName
 *         - projectNumber
 *         - drawingsIssued
 *         - media
 *         - issuedBy
 *         - receiveBy
 */

const issueSheetSchema = new Schema({
    issueSheetNumber: Number,
    to: String,
    attention: String,
    client: String,
    projectName: String,
    projectNumber: Number,
    drawingsIssued: [
        {
            drawing: { type: Schema.Types.ObjectId, ref: 'Drawing' },
            copies: Number
        }
    ],  // ref to drawings in the drawings register
    remarks: String,
    issuedFor: String,
    media: { type: String, enum: ['electronic', 'physical'] },
    issuedBy: {
        name: String,
        signature: String,
        date: { type: Date, default: Date.now() }
    },
    receiveBy: {
        name: String,
        signature: String,
        date: { type: Date, default: Date.now() }
    },

    isSaved: { type: Boolean, default: false }

}, { timestamps: true });



export const IssueSheet = model("IssueSheet", issueSheetSchema);