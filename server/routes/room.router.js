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
            room_status_type.name AS status_name,
            reservation.dnm as dnm,
            guest.first_name,
            guest.last_name
        FROM room
        LEFT JOIN room_type ON room.room_type_id = room_type.id
        LEFT JOIN room_status_type ON room.status_type_id = room_status_type.id        
        LEFT JOIN reservation on room.reservation_id = reservation.id
        LEFT JOIN guest on room.guest_id = guest.id
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

        const { room_id, reservation_id, room_type_id } = req.body;

        const client = await pool.connect();

        await client.query('BEGIN;')

        console.log('reservation_id',reservation_id);
        console.log('room_id', room_id);


        const room = await client.query(
            `   Select * FROM room
                WHERE room.id = $1
                LIMIT 1;
            `,[room_id])


            console.log('room', room)

        if (room.rows[0].reservation_id) { // remove previously assigned reservation from the room so I can assign the new reservation to the room
            await client.query(
            `   UPDATE reservation
                SET room_id = NULL
                WHERE reservation.id = $1;
            `,[room.rows[0].reservation_id])
        }


        const reservation = await client.query( //  assigning a room to new reservation
        `   UPDATE reservation
            SET room_id = $1,
            room_type_id = $2
            WHERE reservation.id = $3
            RETURNING guest_id;
        `,[room_id, room_type_id, reservation_id])
   
        await client.query( // assigning reservation and guest to the room 
        `   UPDATE room
            SET reservation_id = $1,
            guest_id = $2
            WHERE room.id = $3;
        `,[reservation_id, reservation.rows[0].guest_id, room_id])
        
        await client.query('COMMIT;')

        res.sendStatus(200);

    }catch(error) {
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;