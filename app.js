const express = require('express')
const request = require('request')
const https = require('https')

app = express()
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
    const firstName = req.body.first
    const lastName = req.body.last
    const email = req.body.email

    var data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    
    var jsonData = JSON.stringify(data)
    
    const url = 'https://' + process.env.LAST_3_CHARS_OF_MAILCHIMP_API_KEY + 
        '.api.mailchimp.com/3.0/lists/' + process.env.MAILCHIMP_LIST_ID

    const options = {
        method: 'POST',
        auth: process.env.MAILCHIMP_USERNAME + ':' + process.env.MAILCHIMP_API_KEY
    }
    const apiRequest = https.request(url, options, (apiResponse) => {
        apiResponse.on('data', (data) => {
            if(apiResponse.statusCode === 200){
                res.sendFile(__dirname + '/success.html')
            }
            else{
                res.sendFile(__dirname + '/failure.html')
            }
        })
    })

    apiRequest.write(jsonData)
    apiRequest.end()
})

app.post('/failure', (req, res) => {
    res.redirect('/')
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server is running');
})