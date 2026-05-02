const express = require('express')
const router = express.Router()
const db = require('../db/db')
const crypto = require('crypto')

router.post('/:ticketId/token', async (req, res) => {
  const { ticketId } = req.params

  try {
    const ticket = await db.query(
      `SELECT * FROM tickets 
       WHERE id = $1 AND is_active = true`,
      [ticketId]
    )

    if (ticket.rows.length === 0) {
      return res.status(404).json({
        message: 'Ticket not found'
      })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await db.query(
      `INSERT INTO export_tokens 
       (ticket_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [ticketId, token, expiresAt]
    )

    return res.json({
      token,
      expires_at: expiresAt,
      link: `${process.env.BASE_URL}/api/t/${token}`
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/t/:token', async (req, res) => {
  const { token } = req.params

  try {
    const result = await db.query(
      `SELECT et.*, t.short_code, t.valid_until, u.name
       FROM export_tokens et
       JOIN tickets t ON et.ticket_id = t.id
       JOIN users u ON t.user_id = u.id
       WHERE et.token = $1
       AND et.used = false
       AND et.expires_at > now()`,
      [token]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        valid: false,
        message: 'Link expired or already used'
      })
    }

    const data = result.rows[0]

    await db.query(
      `UPDATE export_tokens SET used = true 
       WHERE token = $1`,
      [token]
    )

    await db.query(
      `INSERT INTO validation_events (ticket_id, method)
       VALUES ($1, 'link')`,
      [data.ticket_id]
    )

    return res.json({
      valid: true,
      short_code: data.short_code,
      passenger_name: data.name,
      valid_until: data.valid_until
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