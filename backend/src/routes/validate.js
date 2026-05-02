const express = require('express')
const router = express.Router()
const db = require('../db/db')

router.get('/', async (req, res) => {
  const { code, name } = req.query

  if (!code || !name) {
    return res.status(400).json({
      valid: false,
      message: 'Short code and name are required'
    })
  }

  try {
    const result = await db.query(
      `SELECT t.*, u.name as passenger_name
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       WHERE t.short_code = $1
       AND t.is_active = true
       AND t.valid_until >= CURRENT_DATE`,
      [code.toUpperCase()]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        valid: false,
        message: 'Ticket not found or expired'
      })
    }

    const ticket = result.rows[0]
    const nameMatch = ticket.passenger_name
      .toLowerCase()
      .includes(name.toLowerCase())

    if (!nameMatch) {
      return res.status(403).json({
        valid: false,
        message: 'Name does not match ticket holder'
      })
    }

    await db.query(
      `INSERT INTO validation_events (ticket_id, method)
       VALUES ($1, 'manual')`,
      [ticket.id]
    )

    return res.json({
      valid: true,
      ticket: {
        short_code: ticket.short_code,
        passenger_name: ticket.passenger_name,
        valid_from: ticket.valid_from,
        valid_until: ticket.valid_until
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({
      valid: false,
      message: 'Server error'
    })
  }
})

module.exports = router