const express = require("express");
const fs=require('fs');
const bodyParser = require("body-parser");
const request = require("request");
const http = require("http");

// const parseString=require("xml2js");
// const jsdom = require('jsdom');
// const dom = new jsdom.JSDOM("");
// const jquery = require('jquery')(dom.window);

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var myHeaders = new Headers();
myHeaders.append("apikey", "66Get4HxQpiCKsYn0lzh1HxgSE0eSc0w");


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

var message = "";
var emoResult={};

app.post("/", function(req, res) {
  message = req.body.msg;
  var requestOptions = {
    method: 'POST',
    redirect: 'follow',
    headers: myHeaders,
    body: message,
  };
  if (message != "") {
    fetch("https://api.apilayer.com/text_to_emotion", requestOptions)
      .then(response => response.text())
      .then(result =>{
        console.log(result);
        emoResult=JSON.parse(result);
        var resultm = [];
        for (var i in emoResult)
          resultm.push(emoResult[i]);

        console.log(resultm);
        var index = indexOfMax(resultm);
        var arousal = 0;
        var valence = 0;
        switch (index) {
          case 0:
            arousal = 0.85;
            valence = .25;
            break;
          case 1:
            arousal = -0.95;
            valence = 0.95;
            break;
          case 2:
            arousal = -0.06;
            valence = 0.93;
            break;
          case 3:
            arousal = -0.72;
            valence = -0.59;
            break;
          case 4:
            arousal = -0.59;
            valence = 0.96;
            break;
          default:
        }

        function convert(v) {
          v = (v + 1) * 50000;
          return v;
        }
        valence = convert(valence);
        arousal = convert(arousal);
        var link = "http://musicovery.com/api/V5/playlist.php";
        link = link + "?fct=getfrommood&resultsnumber=5&trackvalence=" + valence + "&trackarousal=" + arousal;
        console.log(link);
        // jquery(".songlink").text(link);
        res.write("<h1>Copy the following link</h1>");
        res.write(link);
      })
      .catch(error => console.log('error', error));
  };

  // res.redirect();
  // document.getElementsByClassName("songlink").innerHTML=link;
   // element.text(link).insert(".songlink")
});


function indexOfMax(arr) {
  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

// "It\'s not funny. This must be a joke! 😡🤬"
app.listen(3000, function() {
  console.log("Server is running");
});

// rhajUJhAsOny8LcEPnIo6gZ9Z7lmUh96
