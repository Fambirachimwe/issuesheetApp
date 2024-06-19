import mongoose, { Schema } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - password
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         firstname:
 *           type: string
 *           description: The first name of the user
 *         lastname:
 *           type: string
 *           description: The last name of the user
 *         password:
 *           type: string
 *           description: The password for the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *           default: "user"
 *         department:
 *           type: string
 *           description: The department of the user
 *       example:
 *         id: 609e1234567890abcdef1234
 *         firstname: John
 *         lastname: Doe
 *         password: password123
 *         email: johndoe@example.com
 *         role: user
 *         department: Sales
 */

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    password: String,
    email: String,
    role: { type: String, default: "user" },
    department: String,
    signature: String // this is the dataURL image 
});


const User = mongoose.model('User', userSchema);
export default User;

