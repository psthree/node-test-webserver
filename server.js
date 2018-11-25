const express = require('express');
//handle bars templeteing
const hbs = require('hbs');
const fs = require('fs');
//gets from machine environment variables to see enter env in the terminal
//when deploying to heroku it will generate this but that means it will fail on our machine
//so we set a default
const port = process.env.PORT || 3000;
var app = express();

//this tells hbs (handle bars) where partials a located
hbs.registerPartials(__dirname + '/views/partials');
//use handlebars templete engine
app.set('view engine', 'hbs');

//load middle ware (app.use)
app.use((req, res, next) => {
  let now = new Date().toString();
  const log = `${now}:${req.method}, ${req.url}`;
  console.log(log);
  //name of file and what to add to it and a line very time '\n'
  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });

  next(); //moves us forward to the next thing in middle ware with out this the code would stop here
});

app.use((req, res, next) => {
  res.render('maintenance.hbs');
});

app.use(express.static(__dirname + '/public'));

//allows hbs to call functions (injected into templates and partials)
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', text => {
  return text.toUpperCase();
});

//handles a get request takes the url and the function to run
// app.get('/', (req, res) => {
//send something back
//   res.send('<h1>HOwdy</h1>');
//sending json
//   res.send({
//     name: 'Peter',
//     likes: ['guitar', 'beatles']
//   });
// });
app.get('/', (req, res) => {
  //send something back
  //   res.send('<h1>HOwdy</h1>');
  //sending json
  // res.send({
  //   name: 'Peter',
  //   likes: ['guitar', 'beatles']
  // });
  res.render('home.hbs', {
    pageTitle: 'Home Page Title',
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores inventore cumque facilis dolorum cupiditate exercitationem corporis consequatur pariatur accusamus assumenda, dignissimos minus, repellat alias. Nihil iure veniam eius iste facere.'
  });
});

app.get('/about', (req, res) => {
  // res.send('A bout Page');
  res.render('about.hbs', {
    pageTitle: 'About Page Title'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'opps looks like a failure'
  });
});

//this is where we listen for requests, it binds to a port on our machine
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//nodemon server.js

//watch these extensions
//nodemon server.js -e js,hbs
