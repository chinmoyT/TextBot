const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const app = express()
const {GoogleGenerativeAI} = require('@google/generative-ai')
import('node-fetch')
.then(fetch=> {
    global.fetch = fetch.default;
})
.catch(error=> console.error('Error importing node-fetch:', error))

dotenv.config()
const port = process.env.port || 5000

const secret_key = process.env.Google_API
const genAI = new GoogleGenerativeAI(secret_key)

app.use(express.json())
app.use(cors())

app.post('/', async(req, res)=> {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const {prompt} = req.body
    if(!prompt){
        return res.status(400).json({message: 'Prompt cannot be empty'})
    }
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    res.send(text)
    
})

app.listen(process.env.port || 5000, ()=> {
    console.log(`Server running on port ${port}`)
})