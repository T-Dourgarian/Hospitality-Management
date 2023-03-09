const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.get('/all', async(req,res) => {
    try {

        const queryText = 
        `
        SELECT 
            room.*,
            room_type.name_short AS room_type,
            room_status_type.name_short AS status_name_short,
            room_status_type.name AS status_name
        FROM room
        LEFT JOIN room_type ON room.room_type_id = room_type.id
        LEFT JOIN room_status_type ON room.status_type_id = room_status_type.id        
        ORDER BY room.number ASC
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



router.post('/assign', async(req,res) => {
    try {

        const { room_id, reservation_id } = req.body;

        const client = await pool.connect();


        await client.query('BEGIN;')

        await client.query(
        `   UPDATE reservation
            SET room_id = $1
            WHERE reservation.id = $2;
        `,[room_id, reservation_id])


        await client.query(
        `   UPDATE room
            SET reservation_id = $1
            WHERE room.id = $2;
        `,[reservation_id, room_id])
        
        await client.query('COMMIT;')

        res.sendStatus(200);

    }catch(error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;