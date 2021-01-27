
module.exports = {
    //make main description of page
    HTML:function (title, list, body,control)
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
    },
    // make list fuction
    list:function(filelist){
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
  }