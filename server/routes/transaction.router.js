const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.post('/post', async (req, res) => {
    const client = await pool.connect();
    
    try {
      const { reservation_id, invoice_id, txns_type_id, amount } = req.body;

      await client.query('BEGIN');

      const insertText = 'INSERT INTO txns (reservation_id, txns_type_id, amount, invoice_id) VALUES ($1, $2, $3, $4)';
      const values = [reservation_id, txns_type_id, amount, invoice_id];
      await client.query(insertText, values);

      const transactionSumText = `
        SELECT SUM(amount) FROM txns 
        left join txns_type tt on txns.txns_type_id = tt.id 
        WHERE invoice_id = $1 and tt.payment = false
      `;
      const sumResult = await client.query(transactionSumText, [invoice_id]);
      const sum = sumResult.rows[0].sum;


      const paymentSumText = `
        SELECT ABS(SUM(amount)) FROM txns 
        left join txns_type tt on txns.txns_type_id = tt.id 
        WHERE invoice_id = $1 and tt.payment = true
      `;
      const paymentSumResult = await client.query(paymentSumText, [invoice_id]);

      const paymentSum = paymentSumResult.rows[0].abs;

      const updateText = 'UPDATE invoice SET total = $1, amount_paid = $2 WHERE id = $3';
      await client.query(updateText, [sum, paymentSum, invoice_id]);
      await client.query('COMMIT');

      res.status(200).json({ success: true, message: 'Transaction created and invoice updated successfully.' });
      
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(400).json({ success: false, message: 'Transaction creation failed.' });
    } finally {
      await client.release();
    }
  });


module.exports = router;