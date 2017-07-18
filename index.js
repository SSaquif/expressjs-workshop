var express = require('express'); //importing express library 
var app = express();  //We are using a expressJS web server
var request = require('request-promise');
var mysql = require('promise-mysql');
var pug = require('pug');
var RedditAPI = require('../../redditCommandLine/reddit-nodejs-api/reddit');
var bodyParser = require('body-parser');

//using the pug templating engine
app.set('view engine', 'pug');

//database connection
var dbConn = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'reddit2',
  connectionLimit: 10
});

//new Reddit API object
var redditFunctions = new RedditAPI(dbConn);

//Endpoint for index page
app.get('/', function (request, respond) {
  respond.send('Hello World!');
});

//Q1 and 2 Using Query String Params, (i.e, ?name=...)
//Endpoint for /hello
app.get('/hello', function (request,respond) 
{
  //console.log(request);
  console.log(request.query);
  if (request.query.hasOwnProperty("name")){
    respond.send(`
      <!DOCTYPE html>
        <body>
          <h1>Hello ${request.query.name}!<h1>
        </body>
    `);
  }
  else {
    respond.send(`
      <!DOCTYPE html>
      <body>
        <h1>Hello World!<h1>
      </body>
    `);
  }
});

//Q3 Using Request Params, (i.e :operation)
//Endpoint for calculator
app.get('/calculator/:operation', function(request, respond)
{
  console.log(request.params.operation);
  if(!request.query.hasOwnProperty("num1"))
  {
    request.query.num1 = 0;
  }
  if(!request.query.hasOwnProperty("num2"))
  {
    request.query.num2 = 0;
  }
  var result = {};
  if(request.params.operation === ':add')
  {
    //NTS:this splits on the dilimiter ':'' and puts the split string in an array
    //so, :add = ['','add']
    result.operation = request.params.operation.split(':')[1];
    //console.log(request.operation);
    result.firstOperand = parseInt(request.query.num1);
    result.secondOperand = parseInt(request.query.num2);
    result.solution = result.firstOperand + result.secondOperand;
    respond.send(JSON.stringify(result));
  }
  else if (request.params.operation === ':multiply')
  {
    result.operation = request.params.operation.split(':')[1];
    result.firstOperand = parseInt(request.query.num1);
    result.secondOperand = parseInt(request.query.num2);
    result.solution = result.firstOperand * result.secondOperand;
    respond.send(JSON.stringify(result));
  }
  else 
  { 
    //since respond is sending JSON, we are being consistent and sending the error as a JSON too.
    respond.status(400).json({error: "Invalid Operation Selected"});
    return; //Important
    //respond.send("Invalid operation selected");
  }
});

//Question 4
//Endpoint for getting reddit posts
/*app.get('/posts', function(request, respond)
{
  redditFunctions.getAllPosts()
  .then(results => {
      var postList = "";
      //first make cancate all posts into a string
      results.forEach(post => {
        postList = postList + 
                  ` <li class="post-item">
                      <h2 class="post-item__title">
                        <a href=${post.url}> ${post.title}</a>
                      </h2>
                        <p>Created by ${post.userData.userName}</p>
                    </li> `;
      });
      respond.send(`<!DOCTYPE html>
                    <body>
                      <div id="posts">
                        <h1>List of posts</h1>
                        <ul class="posts-list">
                          ${postList}
                        </ul>
                      </div>
                    </body>`);
  });
})*/;

//Q5 Endpoint for /new-post
//This code doesnt use pug
/*app.get('/new-post', function(request, respond) {
    respond.send(`<form action="/createPost" method="POST">
                    <p>
                      <input type="text" name="url" placeholder="Enter a URL to content">
                    </p>
                    <p>
                      <input type="text" name="title" placeholder="Enter the title of your content">
                    </p>
                    <button type="submit">Create!</button>
                  </form>`);
});*/

//Q6 Endpoint for /createPost
//creating a urlEncoded bodyParser
// create application/x-www-form-urlEncoded body parser
//This is a middleware
var urlEncodedBodyParser = bodyParser.urlencoded({ extended: false }); 
//The middlewear executes on every time function is called when  passed as argument
app.post('/createPost', urlEncodedBodyParser, function(request, respond) {
    //console.log(request.body);
    //if post data is empty, send error
    if (!request.body) return respond.sendStatus(400);
    
    var postAttributes = {};
    postAttributes.url = request.body.url;
    postAttributes.title = request.body.title;
    postAttributes.userId = 1;
    postAttributes.subredditId =1;
    
    redditFunctions.createPost(postAttributes)
      .then(results => 
      {
        //respond.send(JSON.stringify({success:"New Post Created"}));
        //***When Using app.get
        //use redirect and not send EVER
        respond.redirect('/posts');
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
});


//Q7
//Part 1, Solving Q5 with pug
app.get('/new-post', function(request, respond) {
  respond.render('create-content');
});

//Part-2, Solving Q4 with pug
app.get('/posts', function(request, respond) {
  redditFunctions.getAllPosts()
    .then(results => {
      respond.render('post-list', {posts: results});
    });
});

/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
