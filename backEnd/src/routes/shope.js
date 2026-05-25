const express = require('express')
const router = express.Router()

router.get('/shope',(req,res)=>{
    // console.log('shope',req);
    res.send('hello shope')
    
})

module.exports = router