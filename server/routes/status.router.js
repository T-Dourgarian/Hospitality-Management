const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.put('/checkin', async(req,res) => {
    try {

        const { reservation_id, checkInTime  } = req.body; 

        console.log('reservation_id', reservation_id);


        const client = await pool.connect();

        await client.query('BEGIN;')

        await client.query
        (
            `
            UPDATE reservation
            SET status = 'checked_in',
                checked_in_at = $1
            WHERE id = $2;
            `,
            [checkInTime, reservation_id]
        )

        await client.query
        (
            `
            UPDATE room
                SET vacant = false
            WHERE reservation_id = $1;
            `,
            [reservation_id]
        )

        await client.query('COMMIT;')
        
        res.sendStatus(200)


    }catch(error) {
        console.log(error)
        res.sendStatus(400);
    }
});


router.put('/checkout', async(req,res) => {
    try {

        const { reservation_id, checkOutTime  } = req.body;

        console.log('reservation_id', reservation_id);

        const client = await pool.connect();


        await client.query('BEGIN;')

        await client.query
        (
            `
            UPDATE reservation
            SET status = 'checked_out',
                checked_out_at = $1
            WHERE id = $2;
            `,
            [checkOutTime, reservation_id]
        )

        await client.query
        (
            `
            UPDATE room
                SET vacant = true,
                reservation_id = null,
                guest_id = null
            WHERE reservation_id = $1;
            `,
            [reservation_id]
        )

        await client.query('COMMIT;')
        
        res.sendStatus(200)


    }catch(error) {
        console.log(error)
        res.sendStatus(400);
    }
});


module.exports = router;