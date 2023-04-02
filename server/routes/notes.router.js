const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')





router.post('/new', async(req,res) => {
    try {
        const { text, reservation_id } = req.body;

        const queryText = 
        `
        INSERT INTO public.note(
            reservation_id, text, property_id, created_by, created_at)
            VALUES ($1, $2, $3, $4, $5);
        `;
        
        pool.query(queryText,[reservation_id, text, 1, 1, new Date()])
            .then(result => {
                console.log(result)
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