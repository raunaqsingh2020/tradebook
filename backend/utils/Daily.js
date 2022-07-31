const CronJob = require("cron").CronJob;
const moment = require("moment-timezone");
const User = require('../Model/userModel')  


exports.resetTrials = async () => { 
    const job = new CronJob('0 25 */1 * * *', async function() {
       await User.updateMany({}, {trials: 0})
    },
    null,
    true,
    "America/New_York"
    )
    job.start()
}

// exports.analyticsTextbookCount = async () => { 
//     const job = new CronJob('0 25 */1 * * *', async function() {
//        await User.updateMany({}, {trials: 0})
//     },
//     null,
//     true,
//     "America/New_York"
//     )
//     job.start()
// }

// exports.averageTextbooksOffered = async () => { 
//     const job = new CronJob('0 25 */1 * * *', async function() {
//         await User.aggregate([{
//             "$group": {
//                 "_id": "$_id",
//                 totalCount: { $size: '$textbooks' }
                
//               }
//             }])      
//     },
//     null,
//     true,
//     "America/New_York"
//     )
//     job.start()
// }


// exports.soldValue = async () => { 
//     const job = new CronJob('0 25 */1 * * *', async function() {
//        await User.updateMany({}, {trials: 0})
//     },
//     null,
//     true,
//     "America/New_York"
//     )
//     job.start()
// }