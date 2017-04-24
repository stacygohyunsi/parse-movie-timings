var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var movies = {};
var counter = 1;
var currentLength = 0;
var run = true;

async.whilst(function () {
  return run;
},
function (next) {
  if (counter === 1) {
    request({
      uri: "http://www.cathaycineplexes.com.sg/movies.aspx",
    }, function(error, response, body) {
      
      var $ = cheerio.load(body);
      
      $('.boxes').children().filter('.showing').each(function(i, elem) {
        var title = $(this).children().last().children().first().children().first().text();
        movies[title]={};
        movies[title].href = $(this).children().first().children().first().attr('href'); //movies
        movies[title].locations = [];
      });
      counter = counter + 1;
      next();
    })
  }
  
  if (counter === 2) {
      request({
        uri: "http://www.cathaycineplexes.com.sg/" + movies[Object.keys(movies)[currentLength]].href,
      }, function(error, response, body) {
        var $ = cheerio.load(body);
        var title = $('#ContentPlaceHolder1_lblTitleM').text();
        //get movie title
        $('.tabs').each(function(j, elem) {
          movies[title].locations[j] = {
            name: $(this).children().first().text(), 
            timings: []
          }; //name of place
            
          $(this).children().eq(3).children().first().children().eq(1).children().filter(".showtimeitem_time_pms").each(function(k, elem) {           
            movies[title].locations[j].timings[k] = {
              value: $(this).children().text()
            };
          }) 
                  
        });

        if (currentLength < Object.keys(movies).length)
        {
          currentLength++;
          if (title === Object.keys(movies)[(Object.keys(movies).length-1)]) {
            counter = counter + 1;
          }
          next();
        }

      })
  }
  
  if (counter > 2){      
    run = false;
    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "_"
                    + (currentdate.getMonth()+1)  + "_" 
                    + currentdate.getFullYear() + "_"  
                    + currentdate.getHours() + "_"  
                    + currentdate.getMinutes() + "_" 
                    + currentdate.getSeconds();
                    
                    
    fs.writeFile('timings_'+datetime +'.json', JSON.stringify(movies), function(err){
      console.log('File successfully written! - Check your project directory for the file');
    });  
    
  }
  
},
function (err) {
  // All things are done!
  console.log("done");
});  

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
