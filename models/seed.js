// *********** *********** *********** //
// Import Dependencies                 //
// *********** *********** *********** //

const Drum = require('./drum')
const mongoose = require('../utils/connection')

// seed SCRIPT we can run from terminal with `npm run seed` -> added to package.json
// more secure then seed link previously used

// router.get('/drums/seed', (req, res) => {

//     const seedDrums = [
        // {
        //     manufacturer: "Drum Workshop",
        //     model: "Collector's Series",
        //     finish: "Diamond Sparkle",
        //     pieces: 8,
        //     priceUSD: 5499,
        //     custom: true
        // },{
//             manufacturer: "Pearl",
//             model: "Decade Maple",
//             finish: "Satin Black Burst",
//             pieces: 5,
//             priceUSD: 949,
//             custom: false
//         },{
//             manufacturer: "Ludwig",
//             model: "Vistalite Zep",
//             finish: "Amber",
//             pieces: 5,
//             priceUSD: 3999,
//             custom: false
//         },{
//             manufacturer: "Ddrum",
//             model: "D2",
//             finish: "Red Sparkle",
//             pieces: 5,
//             priceUSD: 499,
//             custom: false
//         }
//     ]

//     // delete all drums

//     Drum.deleteMany({})
//         .then(drums => {
//             // then create initial drum list from the seed
//             Drum.create(seedDrums)
//             .then((drums => {
//                 // response to confirm creation
//                 res.json(data)
//             }))
            
//         })
// })

// *********** *********** *********** //
// Seed Script Code                    //
// *********** *********** *********** //

// db connection, because this is a ONE TIME operation
// connect -> seed db -> disconnect

const db = mongoose.connection

db.on('open', () => {
    const seedDrums = [
        {
            manufacturer: "Drum Workshop",
            model: "Collector's Series",
            finish: "Diamond Sparkle",
            pieces: 8,
            priceUSD: 5499,
            custom: true
        },{
            manufacturer: "Pearl",
            model: "Decade Maple",
            finish: "Satin Black Burst",
            pieces: 5,
            priceUSD: 949,
            custom: false
        },{
            manufacturer: "Ludwig",
            model: "Vistalite Zep",
            finish: "Amber",
            pieces: 5,
            priceUSD: 3999,
            custom: false
        },{
            manufacturer: "Ddrum",
            model: "D2",
            finish: "Red Sparkle",
            pieces: 5,
            priceUSD: 499,
            custom: false
        }
    ]
    // delete all drums which are NOT OWNED
    // when we update our db, we don't want to kill user data that is stored

    Drum.deleteMany({ owner: null })
        .then(() => {
            // then create initial drum list from the seed
            Drum.create(seedDrums)
            .then((data => {
                // response to confirm creation
                console.log('here are the seeded items: \n', data)
                // ALWAYS CLOSE THE CONNECTION
                db.close()
            }))
            .catch(err => {
                console.log('the following error ocurred: \n', err)
                // ALWAYS CLOSE THE CONNECTION
                db.close()
            })
        })
        .catch(err => {
            console.log(err)
            //ALWAYS CLOSE THE CONNECTION
            db.close()
        })
})
