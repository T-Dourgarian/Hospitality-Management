const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.get('/arrivals', async (req,res) => {
    try {

        var date = new Date();

        const yyyymmdd = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDay();

        const queryText = `
            SELECT * from reservation
            JOIN guest ON reservation.guest_id = guest.id
            JOIN room_type ON reservation.room_type_id = room_type.id
            JOIN property ON reservation.property_id = property.id
            JOIN public."user" ON reservation.created_by = public."user".id
            WHERE check_in = '${yyyymmdd}';
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