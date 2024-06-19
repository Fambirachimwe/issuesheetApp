import Counter from "../models/Counter.js";


export const nextIssueSheetNumber = async () => {

    const counter_db = await Counter.find()
    const counter = await Counter.findByIdAndUpdate(
        counter_db[0]._id,
        { $inc: { issueSheetNumber: 1 } },
    );

    // console.log(counter_db)

    return counter.issueSheetNumber
}