const express = require('express')
const cors = require('cors')

const app = express()
const PORT =3000

app.use(cors())
app.use(express.json())

app.get('/api/hello',(req, res)=>{
  res.json({message: 'سلام! API Backend کار می‌کند 🚀'})
})

app.listen(PORT , ()=>{
    console.log(`Server running on http://localhost:${PORT}`);

})