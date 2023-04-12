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
                    )   as notes
                FROM
                    reservation
                LEFT join note ON note.reservation_id = reservation.id
                JOIN guest ON reservation.guest_id = guest.id
                JOIN room_type ON reservation.room_type_id = room_type.id
                JOIN public."user" ON reservation.created_by = public."user".id
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
                    )   as notes
                FROM 
                    reservation
                LEFT join note ON note.reservation_id = reservation.id
                JOIN guest ON reservation.guest_id = guest.id
                JOIN room_type ON reservation.room_type_id = room_type.id
                JOIN public."user" ON reservation.created_by = public."user".id
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
                )   as notes
            FROM 
                reservation
            LEFT join note ON note.reservation_id = reservation.id
            JOIN guest ON reservation.guest_id = guest.id
            JOIN room_type ON reservation.room_type_id = room_type.id
            JOIN public."user" ON reservation.created_by = public."user".id
            FULL OUTER JOIN room ON reservation.room_id = room.id
            FULL OUTER JOIN room_status_type on room.status_type_id = room_status_type.id
            WHERE reservation.status = $1;
    
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
                select array_to_json(array_agg(row(a, at)))
                from additional a
                JOIN additional_type at on at.id = additional_type_id
                where a.reservation_id = reservation.id
            )   as additionals
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

module.exports = router;