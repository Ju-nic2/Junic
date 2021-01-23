var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require(`querystring`)

//make main description of page
function templateHTML(title, list, body,control)
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
     ${control}
      <h2>${title}</h2>
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
// make list fuction
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    var listname = filelist[i].split('.');
    list = list + `<li><a href="/?id=${filelist[i]}">${listname[0]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    //if user clilked and send request msg
    if(pathname === '/'){
      //if this msg from root
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = "JunicWorld";
          var list = templateList(filelist);
          var description = " hello travelrs"
          var template= templateHTML(title,list, `${description}`,`<a href="/create">Create</a>`);
          response.writeHead(200);
          response.end(template);
        }); 
      //else
      }else{
        console.log(url.parse(_url, true));
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`./data/${queryData.id}`,'utf8',function(err, description){
            var title = queryData.id.split('.')[0];
            var list = templateList(filelist);
            var template= templateHTML(title,list,`${description}`,
            `<a href="/create">Create</a> 
             <a href="/update?id=${title}">Update</a>
             <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>`);
            response.writeHead(200);
            response.end(template);
          });   
        });
      }
  //create new file UI and transprot to server  
  }else if(pathname === '/create'){
        fs.readdir('./data', function(error, filelist){
          var title = "Say to Junic";
          var list = templateList(filelist);
          var template= templateHTML(title,list, 
          `<form action="/create_process" method = "post">
              <p><input type="text" name="title" placeholder="who"></p>
              <p><textarea name=description  placeholder="descirption"></textarea>
              </p>
              <p><input type="submit" name="등록">
              </p>
           </form>`
          ,'');
          response.writeHead(200);
          response.end(template);
        }); 
  // if server get 'post' message form browser
  }else if(pathname === '/create_process' ){
    var body = '';
    //get date 
    request.on('data',function(data){
      body = body + data;
    });
    request.on('end',function()
    {
      //parse date to title,description
      var post = qs.parse(body);

      console.log(post);
      var title = post.title;
      var description = post.description;
      //made new file 
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        // redirection to page
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      })
      console.log(title);
      console.log(description);
    });
  //update file and transprot to server  
  }else if(pathname === '/update'){
    fs.readdir('./data', function(error, filelist){
      fs.readFile(`./data/${queryData.id}`,'utf8',function(err, description){
        var title = queryData.id;
        var list = templateList(filelist);
        // "input typue = hidden" can match the file 
        var template= templateHTML(title,list,
        `<form action="/update_process" method = "post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="who" value ="${title}"></p>
            <p><textarea name=description  placeholder="descirption" rows="8" cols="80">${description}</textarea>
            </p>
            <p><input type="submit" name="등록">
            </p>
           </form>`,
        `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`);
        response.writeHead(200);
        response.end(template);
      });   
    });
  //get updated file and fix name,description
  }else if(pathname === '/update_process'){
    var body = '';
    //get date 
    request.on('data',function(data){
      body = body + data;
    });
    request.on('end',function(){
      //parse date to title,description
      var post = qs.parse(body);
      var id = post.id
      var title = post.title;
      var description = post.description;
      console.log(post);
      fs.rename(`data/${id}`,`data/${title}`,function(err){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          // redirection to page
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });

    });
  }else if(pathname === '/delete_process'){
    var body = '';
    //get data 
    request.on('data',function(data){
      body = body + data;
    });
    request.on('end',function()
    {
      //parse date to title,description
      var post = qs.parse(body);
      console.log(post);
      var id = post.id
      fs.stat(`data/${id}`, function (err, stats) {
        console.log(stats);//here we got all information of file in stats variable
        if (err) {
            return console.error(err);
        }  
        fs.unlink(`data/${id}`,function(err){
             if(err) return console.log(err);
             response.writeHead(302, {Location: `/`});
             response.end();
             console.log('file deleted successfully');
        });  
     });
  });
}else{
    console.log(url.parse(_url, true));
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);