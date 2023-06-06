const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')




  router.post('/new', async (req, res) => {
    
    try {

        const { guest_id, reservation_id, cardHolderName, cardNumber, expiration_date, amount, notes } = req.body;
      
        // authorize a cc here

        const queryText = `
        INSERT INTO public.cc_authorization(
            reservation_id, cardholder_name, card_number, expiration_date, authorization_amount, status, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING status;
        `

        const { rows } = await pool.query(queryText, [reservation_id, cardHolderName, cardNumber, expiration_date, amount, 'success', notes]);


        if (rows && rows[0]) {
             return res.status(200).json({status: rows[0].status, message: 'Authorization success'})
        }

        return res.status(400).json({ status: false, message: 'Failed to authorize credit card' });
      
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'Failed to authorize credit card' });
    } finally {
    }
  });


module.exports = router;