const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.post('/post', async (req, res) => {
    try {
      const { reservation_id, additional_id, price, start_date, end_date } = req.body;

      const queryText = `
        INSERT INTO public.additional(
        reservation_id, additional_type_id, end_date, start_date, price)
        VALUES ($1, $2, $3, $4, $5);
      `


      await pool.query(queryText, [ reservation_id, additional_id, price, start_date, end_date ]);

      res.send(200).json({ success: true, message: 'Additional has been created' });
      
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'Additional could not be created' });
    }
});

router.put('/update', async (req, res) => {
    try {
      const { additional_id, price, start_date, end_date } = req.body;

      const queryText = `
        UPDATE additional
        SET 
            start_date = $1,
            end_date = $2,
            price = $3,
        WHERE
            id = $4;
      `


      await pool.query(queryText, [ start_date, end_date, price, additional_id ]);

      res.send(200).json({ success: true, message: 'Additional has been updated' });
      
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'Additional could not be updated' });
    }
});

router.get('/types', async (req, res) => {
    try {
      const queryText = `SELECT * FROM additional_type where property_id = $1`

      const { rows } = await pool.query(queryText, [1]);
      
      res.send(rows).status(200);

    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: err });
    }
});


module.exports = router;