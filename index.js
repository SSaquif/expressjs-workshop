var express = require('express'); //importing express library 
var app = express();  //We are using a expressJS web server
var request = require('request-promise');
var mysql = require('promise-mysql');
var RedditAPI = require('../../redditCommandLine/reddit-nodejs-api/reddit');

//database connection
var dbConn = mysql.createPool({
  host     : 'localhost',
  user     : 'ssaquif',
  password : '',
  database: 'reddit',
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
          <h1>Hello ` + request.query.name + `!<h1>
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
    respond.send("Invalid operation selected");
  }
});

//Endpoint for getting reddit posts
app.get('/posts', function(request, respond)
{
  redditFunctions.getAllPosts()
  .then(results => {
      var postList = "";
      //first make cancate all posts into a string
      results.forEach(post => {
        postList = postList + 
                  ` <li class="post-item">
                      <h2 class="post-item__title">
                        <a href="${post.url}">${post.title}</a>
                      </h2>
                        <p>Created by ${post.userData.userName}</p>
                    </li> `
      })
      //second send them
      respond.send(`<!DOCTYPE html>
                    <body>
                      <div id="posts">
                        <h1>List of posts</h1>
                        <ul class="posts-list">`
                        + postList +
                        `</ul>
                      </div>
                    </body>`);
  });
});



/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
