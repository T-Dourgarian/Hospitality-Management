const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.get('/all', async(req,res) => {
    try {

        const date = new Date();
        const TODAY_YYYYMMDD = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();


        const queryText = 
        `
        SELECT 
            room.*,
            room_type.name_short AS room_type,
            room_status_type.name_short AS status_name_short,
            room_status_type.name AS status_name,
            reservation.dnm as dnm,
            reservation.id as pre_assigned_reservation_id,
            reservation.guest_id as pre_assigned_guest_id,
            guest.first_name,
            guest.last_name
        FROM room
        LEFT JOIN room_type ON room.room_type_id = room_type.id
        LEFT JOIN room_status_type ON room.status_type_id = room_status_type.id        
        LEFT JOIN reservation on room.id = reservation.room_id AND reservation.check_in = $1
        LEFT JOIN guest on reservation.guest_id = guest.id
        ORDER BY room.number ASC
        `;
        
        pool.query(queryText, [TODAY_YYYYMMDD])
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

router.get('/assigned', async(req,res) => {
    try {

        let futureDate = new Date()
        let today = new Date()

        futureDate.setDate(futureDate.getDate() + 10);


        const assignedReservationsQuery = 
        `
        SELECT 
            res.id,
            res.check_in,
            res.check_out,
            res.room_id,
            res.num_of_nights,
            guest.id as guest_id,
            guest.first_name,
            guest.last_name
        FROM reservation res
        RIGHT JOIN guest ON res.guest_id = guest.id
        WHERE 
            check_in <= $1 AND
            check_out > $2 AND
            res.room_id IS NOT NULL AND
            res.status <> 'checked_out' AND
            res.status <> 'cancelled'
        ORDER BY check_in ASC
        `;
        
        const { rows: assignedReservations } =  await pool.query(assignedReservationsQuery, [futureDate, today])


        res.status(200).send(assignedReservations)
        


    }catch(error) {
        console.log(error)
        res.sendStatus(400);
    }
});


router.get('/roomlist', async(req,res) => {
    try {

        const roomListQuery = 
        `
        SELECT 
            room.id,
            room.number,
            room.vacant,
            rst.name as status,
            rst.name_short as status_short,
            rt.name_short
        FROM room
        LEFT JOIN room_status_type rst ON room.status_type_id = rst.id
        LEFT JOIN room_type rt ON room.room_type_id = rt.id
        WHERE room.property_id = 1
        ORDER BY room.id ASC;
        `

        const { rows: roomList } =  await pool.query(roomListQuery);

        res.status(200).send(roomList);

    }catch(error) {
        console.log(error)
        res.sendStatus(400);
    }
});

// actually just a get request
// router.post('/inventory', async(req,res) => {
//     try {

//         const { date, dateArray } = req.body;

//         const totalInventoryQuery = 
//         `
//         SELECT room_type.id, room_type.name_short, count(*) FROM room
//             LEFT JOIN room_type ON room.room_type_id = room_type.id
//             WHERE inventory_status = 'available'
//             GROUP BY room_type.id, room_type.name_short;
//         `;

//         let bookedInventoryQuery = 
//             `
//             SELECT COUNT(room_type.id), room_type.name_short, room_type.id 
//             FROM room_type
//             LEFT JOIN reservation ON room_type.id = reservation.room_type_id 
//             WHERE reservation.check_in <= $1 AND 
//                 reservation.check_out > $1 AND 
//                 reservation.status != 'cancelled' AND
//                 reservation.status != 'checked_out'
//             GROUP BY  room_type.name_short, room_type.id
//             ORDER BY room_type.id ASC
//             `;

//         const roomTypeQuery = 
//         `
//         SELECT *
//         FROM room_type
//         ORDER BY id ASC;
//         `;

        
//         let bookedInventory = {};
        
//         if (dateArray) {
//             for (let i = 0; i < dateArray.length;  i ++) {
//                 let { rows } = await pool.query(bookedInventoryQuery, [dateArray[i]]);
                
//                 bookedInventory[dateArray[i]] = rows;
                
//             }
//         } else {
//             const { rows } = await pool.query(bookedInventoryQuery, date);
            
//             bookedInventory[date] = rows;
//         }
        
        
//         const { rows: totalInventory } = await pool.query(totalInventoryQuery);
//         const { rows: roomTypes } = await pool.query(roomTypeQuery);

//         res.send({
//             totalInventory,
//             bookedInventory,
//             roomTypes
//         });


//     }catch(error) {
//         console.log(error)
//         res.sendStatus(400);
//     }
// });



router.post('/assign', async(req,res) => {
    const client = await pool.connect();

    try {
        const { room_id, reservation_id, room_type_id } = req.body;

        await client.query('BEGIN;')

        await client.query(
            `
                UPDATE reservation
                SET room_id = $2,
                    room_type_id = $3
                WHERE id = $1;
            `,
            [reservation_id, room_id, room_type_id]
        );
        await client.query('COMMIT;')

        res.sendStatus(200);

    }catch(error) {
        await client.query('ROLLBACK');
        console.log(error)
        res.sendStatus(400);
    }
});

router.post('/inventory', async(req,res) => {
    const client = await pool.connect();

    try {
        const { dateArray, roomTypeArray} = req.body;


        const roomTypeForcastQuery = 
        `SELECT
        rt.id AS room_type_id,
        COALESCE(total_reservations, 0) AS total_reservations,
        COALESCE(total_inventory, 0) AS total_inventory
    FROM
        room_type rt
        LEFT JOIN (
            SELECT
                room_type_id,
                COUNT(*) AS total_reservations
            FROM
                reservation
            WHERE
                check_in <= $1
                AND check_out > $1
            GROUP BY
                room_type_id
        ) AS r ON rt.id = r.room_type_id
        LEFT JOIN (
            SELECT
                room_type_id,
                COUNT(*) AS total_inventory
            FROM
                room
            GROUP BY
                room_type_id
        ) AS ri ON rt.id = ri.room_type_id
        WHERE
            rt.id = ANY($2);
        `
        

        await client.query('BEGIN;')

        let forcastData = [];

        for (const date of dateArray) {
            let { rows } = await client.query(
                roomTypeForcastQuery,
                [date, roomTypeArray]
            );

            forcastData.push({
                [date]: rows
            });
        }

        await client.query('COMMIT;')

        res.status(200).send(forcastData);

    }catch(error) {
        await client.query('ROLLBACK');
        console.log(error)
        res.sendStatus(400);
    }
});



module.exports = router;