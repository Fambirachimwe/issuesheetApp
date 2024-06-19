import { model, Schema } from "mongoose";


const counterSchema = new Schema({
    issueSheetNumber: { type: Number, default: 1 }
});

export const Counter = model("Counter", counterSchema);

export default Counter;
