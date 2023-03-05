const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.get('/all', async(req,res) => {
    try {

        const queryText = 
        `
        select 
            room.*,
            room_type.name_short as type_name_short,
            room_status_type.name_short status_name_short
        from room
        LEFT JOIN room_type on room.room_type_id = room_type.id
        LEFT JOIN room_status_type on room.status_type_id = room_status_type.id        
        `;
        
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