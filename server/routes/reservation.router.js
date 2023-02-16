const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.get('/arrivals', async (req,res) => {
    try {

        var date = new Date();

        const yyyymmdd = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        // still need to adjust query -> WHERE property.id = X
        const queryText = `
            SELECT 
                reservation.*, 
                public."user".first_name as created_by_first_name, 
                public."user".last_name as created_by_last_name, 
                public."user".username as created_by_username, 
                guest.*,
                room_type.*,
                room.number as room_number,
                room.name as room_name,
                room_status_type.name as room_status,
                room_status_type.name_short as room_status_short
            FROM reservation
            JOIN guest ON reservation.guest_id = guest.id
            JOIN room_type ON reservation.room_type_id = room_type.id
            JOIN public."user" ON reservation.created_by = public."user".id
            FULL OUTER JOIN room ON reservation.room_id = room.id
            FULL OUTER JOIN room_status_type on room.status_type_id = room_status_type.id
            WHERE check_in = '${yyyymmdd}' AND reservation.status = 'arriving';
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