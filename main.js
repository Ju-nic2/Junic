var http = require('http');
var fs = require('fs');
var url = require('url');


function templateHTML(title, list, body)
{
  return `
      <!doctype HTML>
    <HTML>
    <head>
      <title>JunicWorld</title>
      <meta charset="utf-8">
      <link rel="stylesheet" href="frame.css">
      <link rel="stylesheet" href="index.css">
    </head>
    <body>
    <p id ="title"><a href="/">JunicWorld</a></p>
    <div id="indexBody">
      <p style="margin-top:5px;">
        <img src = "indexSample.jpg" width="400dp">
      </p>
      ${list}
      ${body}    
    </div>
    <div id= "last">
      <div style="text-align:left">Since 2021</div>
      <div style="text-align:right">contact : ata97@naver.com</div>
    </div>
    </body>
    </HTML>
    `;
}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = "JunicWorld"
          var list = templateList(filelist);
          var description = " hello travelrs"
          var template= templateHTML(title,list, `<h2>${title}</h2>${description}`)
          response.writeHead(200);
          response.end(template);
        }); 
      }else{
        console.log(url.parse(_url, true));
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`./data/${queryData.id}`+'.txt','utf8',function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template= templateHTML(title,list,`<h2>${title}</h2>${description}`)
            response.writeHead(200);
            response.end(template);
          });   
        });
      }
      
  }else{
    console.log(url.parse(_url, true));
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);