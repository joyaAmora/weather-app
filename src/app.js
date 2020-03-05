const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname)
// console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
//app.use(express.static(path.join(__dirname, '../public'))) short cut if public with views instead of templates
const partialPath = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialPath)

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'Jade'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'about me',
        name: 'Jade'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'help page',
        name: 'Jade'
    })
})

/* exemples
 app.get('/help', (req, res) => {
     res.send([{
         name: 'Jade',
         age: 29
     }, {
         name: 'Andrew',
         age: 27
     }])
 })

 app.get('/about', (req, res) => {
     res.send('<h1>About</h1>')
 })*/

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'you must provide an address'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {})=> { //with default object setup if object not provide
        if(error){
            return res.send({error}) //short hand syntax
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
    // res.send({
    //     forecast: 'It is cold',
    //     location: 'Shawinigan',
    //     addresse: req.query.address
    // })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'you must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        product: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404page', {
        title: '404 page',
        name: 'Jade',
        errorMessage: 'help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404page', {
        title: '404 page',
        name: 'Jade',
        errorMessage: 'page not found'
    })
})
app.listen(port, () => {
    console.log('server up on port ' + port)
})