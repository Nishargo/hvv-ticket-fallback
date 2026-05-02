require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/tickets', require('./routes/tickets'))
app.use('/api/export', require('./routes/export'))
app.use('/api/validate', require('./routes/validate'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app