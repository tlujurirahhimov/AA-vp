const express = require('express')
const dateTimeET = require('./public/src/dateTimeET.js');
const fs = require('fs').promises
const bodyparser = require('body-parser')

const textRef = 'public/txt/vanasonad.txt'
const regTextRef = 'public/txt/visits.txt'
//käivitan express() funktsiooni ja tähistan töötava asja nimega "app"
const app = express()

//määrame veebilehe mallide järgi renderdamise mootori (ejs)
app.set('view engine', 'ejs')

//muudan "public" veebiserverile kättesaadavaks
app.use(express.static('public'))
//hakkame päringuid parsima
app.use(bodyparser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    //res.send('Express.js veeb käivitus!')
    const day = dateTimeET.weekDayET()
    const date = dateTimeET.dateET()
    const time = dateTimeET.timeET()
    res.render('index', {day: day, date: date, time: time})
})

app.get('/regvisit', (req, res)=>{
    res.render('regvisit')
})

app.post('/regvisit', async (req, res)=>{
    console.log(req.body)
    try {
        await fs.open(regTextRef, 'a')
        await fs.appendFile(regTextRef, req.body.nameInput + ';' + dateTimeET.dateET() + ';' + dateTimeET.timeET() + ';' + dateTimeET.weekDayET() + '\n')
        res.render('regvisit')
    } catch (err) {
        console.log(err)
        res.render('regvisit')
    }
})

app.get('/vanasona', async (req, res)=> {
    try{
        const data = await fs.readFile(textRef, 'utf8')
        let folkWisdom = data.split(';')
        let wisdom = folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]
        res.render('wisdom', {wisdom: wisdom})
    }
    catch (err){
        console.log(err)
        res.render('wisdom', {wisdom: 'Kahjuks ühtegi vanasõna ei leitud!'})
    }
})

app.get('/minulugu', async (req, res)=>{
    try{
        res.render('minulugu')
    }
    catch (err){
        console.log(err)
        res.render('minulugu')
    }
})

app.get('/visits', async (req, res)=>{
    try{
        const data = await fs.readFile(regTextRef, 'utf8')
        let lines = data.trim().split('\n').filter(line => line.trim() !== '')
        let parts = (lines[lines.length - 1] || '').split(';')
        res.render('visits', {name: parts[0], date: parts[1], time: parts[2], day: parts[3]})
    }
    catch (err){
        console.log(err)
        res.render('visits', {name: '', date: '', time: '', day: ''})
    }
})

app.listen(5315)