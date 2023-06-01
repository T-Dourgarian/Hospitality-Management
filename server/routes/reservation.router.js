const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.get('/list/:type', async (req,res) => {
    try {

        // arrivals, departures, inhouse
        const { type: TYPE } = req.params;

        let date = new Date();

        const TODAY_YYYYMMDD = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        // still need to adjust query -> WHERE property.id = X
        let queryText = ``;
       
        if (TYPE === 'arrivals') {
            queryText = 
            `
                SELECT 
                    DISTINCT ON (reservation.id)
                    reservation.id as reservation_id,
                    reservation.status as status,
                    reservation.check_in,
                    reservation.check_out,
                    reservation.num_of_nights,
                    reservation.average_rate, 
                    guest.last_name,
                    guest.first_name,
                    room_type.name_short,
                    room.number as room_number,
                    room.name as room_name,
                    room_status_type.name as room_status,
                    room_status_type.name_short as room_status_short
                FROM
                    reservation
                JOIN guest ON reservation.guest_id = guest.id
                JOIN room_type ON reservation.room_type_id = room_type.id
                FULL OUTER JOIN room ON reservation.room_id = room.id
                FULL OUTER JOIN room_status_type on room.status_type_id = room_status_type.id
                WHERE reservation.check_in = $1 AND reservation.status = $2;
            `;


                // returning arrivals
            pool.query(queryText,[TODAY_YYYYMMDD, 'reserved'])
                .then(result => {
                    res.send(result.rows);
                })
                .catch(error => {
                    console.log(error);
                    res.sendStatus(500);
                });
        } else if ( TYPE === 'departures') {

            queryText=
            `
                SELECT 
                    DISTINCT ON (reservation.id)
                    reservation.id as reservation_id,
                    reservation.status as status,
                    reservation.check_in,
                    reservation.check_out,
                    reservation.num_of_nights,
                    reservation.average_rate, 
                    guest.last_name,
                    guest.first_name,
                    room_type.name_short,
                    room.number as room_number,
                    room.name as room_name,
                    room_status_type.name as room_status,
                    room_status_type.name_short as room_status_short
                FROM 
                    reservation
                JOIN guest ON reservation.guest_id = guest.id
                JOIN room_type ON reservation.room_type_id = room_type.id
                FULL OUTER JOIN room ON reservation.room_id = room.id
                FULL OUTER JOIN room_status_type on room.status_type_id = room_status_type.id
                WHERE reservation.check_out = $1 AND reservation.status = $2;
            `

            pool.query(queryText, [TODAY_YYYYMMDD, 'checked_in'])
            .then(result => {
                res.send(result.rows);
            })
            .catch(error => {
                console.log(error);
                res.sendStatus(500);
            });

        } else if ( TYPE === 'inhouse') {
            queryText=
            `
            SELECT 
                reservation.id as reservation_id,
                reservation.status as status,
                reservation.check_in,
                reservation.check_out,
                reservation.num_of_nights,
                reservation.average_rate, 
                guest.last_name,
                guest.first_name,
                room_type.name_short,
                room.number as room_number,
                room.name as room_name,
                room_status_type.name as room_status,
                room_status_type.name_short as room_status_short
            FROM 
                reservation 
            JOIN guest ON reservation.guest_id = guest.id
            JOIN room_type ON reservation.room_type_id = room_type.id
            FULL OUTER JOIN room ON reservation.room_id = room.id
            FULL OUTER JOIN room_status_type on room.status_type_id = room_status_type.id
            WHERE reservation.status = $1
            ORDER BY room.number ASC;
    
            `

            pool.query(queryText,['checked_in'])
            .then(result => {
                res.send(result.rows);
            })
            .catch(error => {
                console.log(error);
                res.sendStatus(500);
            });

        } else {
            pool.query(queryText)
            .then(result => {
                res.send(result.rows);
            })
            .catch(error => {
                console.log(error);
                res.sendStatus(500);
            });
        }

    
    }catch(error) {
        console.log(error)
        res.sendStatus(400);
    }
});


router.get('/single/:reservation_id', async (req,res) => {
    try {

        const { reservation_id } = req.params;


        const queryText = 
        `
        SELECT 
            DISTINCT ON (reservation.id)
            reservation.id as reservation_id,
            reservation.*, 
            public."user".first_name as created_by_first_name, 
            public."user".last_name as created_by_last_name, 
            public."user".username as created_by_username, 
            guest.*,
            room_type.*,
            room.number as room_number,
            room.name as room_name,
            room_status_type.name as room_status,
            room_status_type.name_short as room_status_short,
            (
                select array_to_json(array_agg(row(n, guest)))
                from note n
                JOIN public."user" on note.created_by = public."user".id
                where n.reservation_id = reservation.id
            )   as notes,
            (
                select array_to_json(array_agg(row(a, at, i)))
                from additional a
                JOIN additional_type at on at.id = additional_type_id
                JOIN invoice i on a.invoice_id = i.id
                where a.reservation_id = reservation.id
            )   as additionals,
            (
                select array_to_json(array_agg(row(t, tt)))
                from txns t
                JOIN txns_type tt on t.txns_type_id = tt.id
                where t.reservation_id = reservation.id
            )   as transactions,
            (
                select array_to_json(array_agg(row(i, it)))
                from invoice i
                JOIN invoice_type it on i.invoice_type_id = it.id
                where i.reservation_id = reservation.id
            )   as invoices,
            (
                select json_agg(json_build_object('id', s.id, 'rate', s.rate::text, 'date', s.date))
                from stay_details s
                where s.reservation_id = $1
            )   as stay_details
        FROM 
            reservation
        LEFT join note ON note.reservation_id = reservation.id
        JOIN guest ON reservation.guest_id = guest.id
        JOIN room_type ON reservation.room_type_id = room_type.id
        JOIN public."user" ON reservation.created_by = public."user".id
        FULL OUTER JOIN room ON reservation.room_id = room.id
        FULL OUTER JOIN room_status_type on room.status_type_id = room_status_type.id
        WHERE reservation.id = $1;
        `
        
        pool.query(queryText, [reservation_id])
        .then(result => {
            res.send(result.rows[0]);
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



router.post('/new', async (req,res) => {
    const client = await pool.connect();

    try {

        client.query('BEGIN;')

        const { lastName, firstName, email, phoneNumber, checkIn, checkOut, numberOfNights, roomType, ratePlan, adults, children, note, dates } = req.body;

        const guestQuery = `
            SELECT id 
            FROM guest
            WHERE email = $1; 
        `;

        const insertReservationQuery = `
        INSERT INTO public.reservation(
            guest_id, check_in, check_out, average_rate, property_id,  cancelled, notes, room_type_id, num_of_nights, status, adults, kids, rate_plan_id, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id;
        `;
        
        const insertInvoicesQuery = `
            INSERT INTO public.invoice(
                reservation_id, guest_id, total, amount_paid, property_id, invoice_type_id)
                VALUES ($1, $2, 0.00, 0.00, 1, 1),
                    ($1, $2, 0.00, 0.00, 1, 2),
                    ($1, $2, 0.00, 0.00, 1, 3),
                    ($1, $2, 0.00, 0.00, 1, 4);
        `;


        const insertStayDetailsQuery = `
                INSERT INTO stay_details
                    (reservation_id, rate, date)
                VALUES ($1, $2, $3);`;

        let { rows: guest } = await client.query(guestQuery, [email]);

        console.log('guest', guest)

        let guest_id;

        if (!guest[0]) {
            const guestInsertQuery = `
                INSERT INTO public.guest(
                    first_name, last_name,email, phone_number, property_id, created_by)
                    VALUES  ($1, $2, $3, $4, $5, $6)
                    RETURNING id;
            `

            const { rows: newGuest } = await client.query(guestInsertQuery, [firstName, lastName, email, phoneNumber, 1, 1]);

            guest_id = newGuest[0].id
        } else {
            guest_id = guest[0].id;
        }

        let { rows: reservation } = await client.query(
            insertReservationQuery,
            [ guest_id, checkIn, checkOut, ratePlan.base_price, 1, false, note, roomType.id, numberOfNights, 'reserved', adults, children, ratePlan.id, 1]
        );


        const reservation_id = reservation[0].id

        await client.query(insertInvoicesQuery, [reservation_id, guest_id] )


        for (const date of dates) {
            await client.query(insertStayDetailsQuery, [reservation_id, ratePlan.base_price, date])
        }
              

      

        await client.query('COMMIT;')
        res.sendStatus(200);
        
    
    }catch(error) {
        client.query('ROLLBACK;')
        console.log(error)
        res.sendStatus(400);
    }
});

module.exports = router;