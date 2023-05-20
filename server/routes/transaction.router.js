const express = require('express');
const router = express.Router();
const axios = require("axios");
const uuid = require('uuid');
const pool = require('../pool')



router.post('/post', async (req, res) => {
  const client = await pool.connect();

  try {
    const { reservation_id, invoice_type_id, txns_type_id, amount } = req.body;

    await client.query('BEGIN');



    const invoiceIdText = `SELECT * FROM Invoice where reservation_id = $1 AND invoice_type_id = $2`

    const invoice = await client.query(invoiceIdText, [reservation_id, invoice_type_id]);
    const invoice_id = invoice.rows[0].id


    const insertText = 'INSERT INTO txns (reservation_id, txns_type_id, amount, invoice_id) VALUES ($1, $2, $3, $4)';
    const values = [reservation_id, txns_type_id, amount, invoice_id];
    const result = await client.query(insertText, values);

    // console.log(result);

    const updateText = `
      UPDATE invoice SET
        total = (
          SELECT COALESCE(SUM(amount), 0) FROM txns 
          LEFT JOIN txns_type ON txns.txns_type_id = txns_type.id 
          WHERE invoice_id = $1 AND txns_type.payment = false
        ),
        amount_paid = (
          SELECT COALESCE(ABS(SUM(amount)), 0) FROM txns 
          LEFT JOIN txns_type ON txns.txns_type_id = txns_type.id 
          WHERE invoice_id = $1 AND txns_type.payment = true
        )
      WHERE id = $1
    `;
    await client.query(updateText, [invoice_id]);
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

router.post('/discount', async (req, res) => {
  const client = await pool.connect();

  try {
    const { reservation_id, invoice_type_id, txns_type_id, txns_id, amount } = req.body;

    await client.query('BEGIN');

    const invoiceIdText = `SELECT * FROM Invoice where reservation_id = $1 AND invoice_type_id = $2`

    const invoice = await client.query(invoiceIdText, [reservation_id, invoice_type_id]);
    const invoice_id = invoice.rows[0].id


    const insertText = 'INSERT INTO txns (reservation_id, txns_type_id, amount, invoice_id, show_on_folio, adjusted_txns_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const values = [reservation_id, txns_type_id, amount, invoice_id, false, txns_id];
    const result = await client.query(insertText, values);

    // console.log(result);


    const updateOriginalTxnsText = `
      UPDATE TXNS
      SET 
        show_on_folio = false,
        adjusted_txns_id = $1
      WHERE 
        id = $2;
    `

    await client.query(updateOriginalTxnsText, [result.rows[0].id, txns_id]);

    const updateText = `
      UPDATE invoice SET
        total = (
          SELECT COALESCE(SUM(amount), 0) FROM txns 
          LEFT JOIN txns_type ON txns.txns_type_id = txns_type.id 
          WHERE invoice_id = $1 AND txns_type.payment = false
        ),
        amount_paid = (
          SELECT COALESCE(ABS(SUM(amount)), 0) FROM txns 
          LEFT JOIN txns_type ON txns.txns_type_id = txns_type.id 
          WHERE invoice_id = $1 AND txns_type.payment = true
        )
      WHERE id = $1
    `;
    await client.query(updateText, [invoice_id]);
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


  router.put('/transfer/:reservation_id', async (req, res) => {
    const client = await pool.connect();
    
    try {
      const { reservation_id } = req.params;
      const { txn_ids, invoice_id } = req.body;

      await client.query('BEGIN');


      const updateTransactionQueryText = `
        UPDATE txns
        SET invoice_id = $1
        WHERE id = ANY($2);
      `

      await client.query({
        text: updateTransactionQueryText,
        values:  [invoice_id, txn_ids]
      });


      const updateInvoices = `
          UPDATE invoice
            SET total = (
              SELECT COALESCE(SUM(amount), 0)
              FROM txns
              WHERE txns.invoice_id = invoice.id
              AND txns.txns_type_id NOT IN (
                SELECT id FROM txns_type WHERE payment = true
              )
            ),
            amount_paid = (
              SELECT COALESCE(ABS(SUM(amount)), 0)
              FROM txns
              WHERE txns.invoice_id = invoice.id
              AND txns.txns_type_id IN (
                  SELECT id FROM txns_type WHERE payment = true
                )
            )
          WHERE reservation_id = $1;
      `
      await client.query(updateInvoices, [reservation_id]);



      await client.query('COMMIT');

      res.status(200).json({ success: true, message: 'Transactions moved and invoice updated successfully.' });
      
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(400).json({ success: false, message: 'Transaction update failed.' });
    } finally {
      await client.release();
    }
  });



  router.get('/types', async (req, res) => {
    
    try {
      
      const queryText = `
        SELECT * from txns_type WHERE property_id = 1
      `

      const results = await pool.query(queryText);


      res.status(200).json(results.rows);
      
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: 'Couldn"t fetch transaction types' });
    } finally {
    }
  });


module.exports = router;