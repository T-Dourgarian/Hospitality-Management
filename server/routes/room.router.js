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

// actually just a get request
router.post('/inventory', async(req,res) => {
    try {

        const { date, dateArray } = req.body;

        const totalInventoryQuery = 
        `
        SELECT room_type.id, room_type.name_short, count(*) FROM room
            LEFT JOIN room_type ON room.room_type_id = room_type.id
            WHERE inventory_status = 'available'
            GROUP BY room_type.id, room_type.name_short;
        `;

        let bookedInventoryQuery = 
            `
            SELECT COUNT(room_type.id), room_type.name_short, room_type.id 
            FROM room_type
            LEFT JOIN reservation ON room_type.id = reservation.room_type_id 
            WHERE reservation.check_in <= $1 AND 
                reservation.check_out > $1 AND 
                reservation.status != 'cancelled' AND
                reservation.status != 'checked_out'
            GROUP BY  room_type.name_short, room_type.id
            ORDER BY room_type.id ASC
            `;

        const roomTypeQuery = 
        `
        SELECT *
        FROM room_type
        ORDER BY id ASC;
        `;


        let bookedInventory = {};
        
        if (dateArray) {
            for (let i = 0; i < dateArray.length;  i ++) {
                let { rows } = await pool.query(bookedInventoryQuery, [dateArray[i]]);

                bookedInventory[dateArray[i]] = rows;

            }
        } else {
            const { rows } = await pool.query(bookedInventoryQuery, date);

            bookedInventory[date] = rows;
        }


        const { rows: totalInventory } = await pool.query(totalInventoryQuery);
        const { rows: roomTypes } = await pool.query(roomTypeQuery);

        res.send({
            totalInventory,
            bookedInventory,
            roomTypes
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



        const room = await client.query(
            `   Select * FROM room
                WHERE room.id = $1
                LIMIT 1;
            `,[room_id])



        if (room.rows[0].reservation_id) { // remove previously assigned room from reservation so I can assign the room to the new reservation
            await client.query(
            `   UPDATE reservation
                SET room_id = NULL
                WHERE reservation.id = $1;
            `,[room.rows[0].reservation_id])
        }


        const reservation = await client.query( //  assigning the room to new reservation
        `   Select * FROM reservation
            WHERE id = $1;
        `,[reservation_id]);

        if (reservation.rows[0].room_id) { // unassign old room if there was a room already assigned
            await client.query( 
            `   UPDATE ROOM
                SET reservation_id = NULL,
                    guest_id = NULL
                WHERE id = $1
            `,[reservation.rows[0].room_id]);
        };


        await client.query( //  assigning room to reservation record
        `   UPDATE reservation
            SET room_id = $1,
                room_type_id = $2
            WHERE reservation.id = $3
            RETURNING guest_id;
        `,[room_id, room_type_id, reservation_id])
   
        await client.query( // assigning reservation and guest to the room record
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