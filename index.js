var express = require('express'); //importing express library 
var app = express();  //We are using a expressJS web server

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
    //this splits on the dilimiter ':'' and puts the split string in an array
    //:add = [:,add]
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


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  console.log('Example app listening at http://%s', process.env.C9_HOSTNAME);
});
