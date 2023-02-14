const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.get('/property', async(req,res) => {
    try {

        console.log('asdfasdfasdf')
        const queryText = `SELECT * FROM "Users";`;
        
        pool.query(queryText)
            .then(result => {
                res.send(result.rows);
            })
            .catch(error => {
                console.log(error);
                res.sendStatus(500);
            });


    }catch(error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;


// router.post('/', async(req,res) => {
//     try {

//         const { firstName, lastName, userName, password, propertyId } = req.body;

//         const queryText = `Insert into properties";`;
        
//         pool.query(queryText)
//             .then(result => {
//                 res.send(result.rows);
//             })
//             .catch(error => {
//                 console.log(error);
//                 res.sendStatus(500);
//             });


//     }catch(error) {
//         console.log(error)
//         res.sendStatus(400);
//     }
// });