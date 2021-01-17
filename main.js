var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    console.log(queryData.id);
    if(_url == '/'){
      title = 'hi';
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);
    }
    response.writeHead(200);
    fs.readFile(`data/${queryData.id}`+'.txt','utf8',function(err, description){
      //console.log(data);
      var template=`
      <!doctype HTML>
  <HTML>
    <head>
      <title>${title}</title>
      <meta charset="utf-8">
      <link rel="stylesheet" href="frame.css">
      <link rel="stylesheet" href="index.css">
    </head>
  <body>
    <p id ="title"><a href="/">Junic World</a></p>
    <div id="indexBody">
      <p style="margin-top:5px;">
        <img src = "indexSample.jpg" width="400dp">
      </p>
      <p>
       ${description};
      </p>
      <h2>${title}</h2>
      <ul class = "mainList">
        <li><a href="/?id=profile">Profile</a> </li>
        <li><a href="/?id=index">HTML</a></li>
        <li><a href="/?id=c++">C++</a></li>
        <li><a href="/?id=guitar">Guitar</a></li>
      </ul>
    </div>
    <div id= "last">
      <div style="text-align:left">Since 2021</div>
      <div style="text-align:right">contact : ata97@naver.com</div>
    </div>
  </body>
  </HTML>
  `;
  console.log(__dirname + _url);
  //response.end(fs.readFileSync(__dirname + _url));
    response.end(template);
  });
});
app.listen(3000);