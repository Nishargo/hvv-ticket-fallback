const express = require('express')
const router = express.Router()
const db = require('../db/db')
const auth = require('../middleware/auth')
const crypto = require('crypto')

const generateShortCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const part1 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  const part2 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `HH-${part1}-${part2}`
}

router.get('/me', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, tt.name as ticket_type_name
       FROM tickets t
       JOIN ticket_types tt ON t.ticket_type_id = tt.id
       WHERE t.user_id = $1
       AND t.is_active = true
       AND t.valid_until >= CURRENT_DATE
       ORDER BY t.created_at DESC`,
      [req.userId]
    )

    return res.json({ tickets: result.rows })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, tt.name as ticket_type_name, u.name as passenger_name
       FROM tickets t
       JOIN ticket_types tt ON t.ticket_type_id = tt.id
       JOIN users u ON t.user_id = u.id
       WHERE t.id = $1
       AND t.user_id = $2`,
      [req.params.id, req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Ticket not found'
      })
    }

    return res.json({ ticket: result.rows[0] })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router