var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require(`querystring`);
var path = require('path');

var template = require('./lib/template.js');

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
          var list = template.list(filelist);
          var description = " hello travelrs"
          var HTML= template.HTML(title,list, `${description}`,`<a href="/create">Create</a>`);
          response.writeHead(200);
          response.end(HTML);
        }); 
      //else
      }else{
        console.log(url.parse(_url, true));
        fs.readdir('./data', function(error, filelist){
          var filteredid = path.parse(queryData.id).base;
          fs.readFile(`./data/${filteredid}`,'utf8',function(err, description){
            var title = queryData.id.split('.')[0];
            var list = template.list(filelist);
            var HTML= template.HTML(title,list,`${description}`,
            `<a href="/create">Create</a> 
             <a href="/update?id=${title}">Update</a>
             <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>`);
            response.writeHead(200);
            response.end(HTML);
          });   
        });
      }
  //create new file UI and transprot to server  
  }else if(pathname === '/create'){
        fs.readdir('./data', function(error, filelist){
          var title = "Say to Junic";
          var list = template.list(filelist);
          var HTML= template.HTML(title,list, 
          `<form action="/create_process" method = "post">
              <p><input type="text" name="title" placeholder="who"></p>
              <p><textarea name=description  placeholder="descirption"></textarea>
              </p>
              <p><input type="submit" name="등록">
              </p>
           </form>`
          ,'');
          response.writeHead(200);
          response.end(HTML);
        }); 
  // if server get 'post' message form browser
  }else if(pathname === '/create_process' ){
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
        var list = template.list(filelist);
        // "input typue = hidden" can match the file 
        var HTML= template.HTML(title,list,
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
        response.end(HTML);
      });   
    });
  //get updated file and fix name,description
  }else if(pathname === '/update_process'){
    var body = '';
    //get data
    request.on('data',function(data){
      body = body + data;
    });
    request.on('end',function(){
      //parse date to title,description
      var post = qs.parse(body);
      var id = post.id
      var filteredid = path.parse(id).base;
      var title = post.title;
      var description = post.description;
      console.log(post);
      fs.rename(`data/${filteredid}`,`data/${title}`,function(err){
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
      var filteredid = path.parse(id).base;
      fs.stat(`data/${filteredid}`, function (err, stats) {
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