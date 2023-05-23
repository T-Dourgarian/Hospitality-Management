const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')




  router.put('/newrate', async (req, res) => {
    
    try {

        const { updateIds, newRate } = req.body;
      
      const queryText = `
        UPDATE stay_details
            SET rate = $1
        WHERE id = ANY($2);
      `

       await pool.query(queryText, [newRate, updateIds]);


      res.sendStatus(200)
      
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'Failed to update rates' });
    } finally {
    }
  });


module.exports = router;