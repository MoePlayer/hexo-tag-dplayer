/**
* hexo-tag-dplayer
* dixyes Created 201708190000
* Syntax:
*  {% dplayer key=value ... %}
*/
'use strict';
const fs = require('hexo-fs'),
  util = require('hexo-util'),
  urlFn = require('url'),
  path = require('path'),
  srcDir = path.dirname(require.resolve('dplayer')),
  mark = "<!-- dplayer used1 -->",
  scriptDir = '/assets/js/', //change this to change js and css dir
  styleDir = '/assets/css/',
  files = [
    ['DPlayer.min.css', styleDir],
    ['DPlayer.min.js', scriptDir],
    ['notexist.min.js', scriptDir],// for robust test TODO: remove this
    // some map for debug use
    ['DPlayer.min.css.map', styleDir],
    //['DPlayer.min.js.map', scriptDir],
    // if there be any other dplayer file
    //['someDplayerFile.xxx', targetDir],
  ];

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    //console.log(target.split(search))
    return target.split(search).join(replacement);
};
  
var counter = 0,
  conf = hexo.config["hexo-tag-dplayer"] || {},
  tbIns=[];

if (!conf.cdn){
  files.forEach(item => {
    var destPath = item[1], filePath = path.join(srcDir, item[0]);
    if (item[1] === scriptDir){
      destPath = conf.js_path || item[1];
    } else if (item[1] === styleDir){
      destPath = conf.css_path || item[1];
    }
    fs.access(filePath, (fs.constants || fs).R_OK , (err) => {
      if(err){
        console.log("INFO  hexo-tag-dplayer: "+item[0]+" is not found in this version of dplayer, skip it.");
      } else {
        hexo.extend.generator.register(path.posix.join(destPath, item[0]), (_) => {
          return {
            path: path.posix.join(destPath, item[0]),
            data: function() {
              return fs.createReadStream(filePath);
            }
          }
        });
        tbIns.push(path.posix.join(destPath, item[0]));
      }
    })
  })
}

hexo.extend.filter.register('after_render:html', (str, data) => {
  //console.log(data);
  if(!data.onRenderEnd && str.includes(mark)){ //make sure dplayer used in final html
    var target = conf.cdn || tbIns,
      s = str.replaceAll(mark,"");
    target.forEach(item => {
      if (item.endsWith(".css")) {
        var tag = util.htmlTag("link", {rel: 'stylesheet', type: 'text/css', href: item }, "");
        s = s.substring(0,s.lastIndexOf("</body>"))+tag+s.substring(str.lastIndexOf("</body>"));
      }else if (item.endsWith(".js")) {
        var tag = util.htmlTag("script", {src: item}, "");
        s = s.substring(0,s.indexOf("</head>"))+tag+s.substring(str.indexOf("</head>"));
      }else if (item.endsWith(".map")) {
        //do nothing when sorce map used
      }else{
        console.log("INFO hexo-tag-dplayer: unknown tile type of cdnfile:"+item);
      }
    })
    //console.log(s)
    return s;
  }
})


// {% dplayer key=value ... %}
hexo.extend.tag.register('dplayer', function(args) {
  let  url, api, loop, autoplay, theme, pic, did, token, screenshot, lang, maximum, hotkey, preload, width, height, addition;
  var  id = 'dplayer' + (counter++);
  args.forEach(item => {
    const k = item.split('=')[0],
      v = item.split('=').length === 1 || item.split('=')[1];
    switch(k){
      case 'autoplay':
        autoplay = v == "true" | v === "yes" | v === "1" | v === true;
        break;
      case 'theme':
        theme = v === true ? "" : v ;
        break;
      case 'loop':
        loop = v == "true" | v === "yes" | v === "1" | v === true;
        break;
      case 'lang':
        lang = v === true ? "" : v ;
        break;
      case 'screenshot':
        screenshot = v == "true" | v === "yes" | v === "1" | v === true;
        break;
      case 'hotkey':
        hotkey = v == "true" | v === "yes" | v === "1" | v === true;
        break;
      case 'preload':
        preload = v === true ? "" : v ;
        break;
      case 'url':
        url = v === true ? "" : v ;
        break;
      case 'pic':
        pic = v === true ? "" : v ;
        break;
      case 'api':
        api = v === true ? "" : v ;
        break;
      case 'id':
        did = v === true ? "" : v ;
        break;
      case 'token':
        token = v === true ? "" : v ;
        break;
      case 'maximum':
        maximum = v === true ? "" : v ;
        break;
      case 'width':
        width = v === true ? "" : v ;
        break;
      case 'height':
        height = v === true ? "" : v ;
        break;
      case 'addition':
        addition = v === true ? "" : v ;
        break;
    }
  })
  
  var raw =  '<div id="'+ id + '" class="dplayer" style="margin-bottom: 20px;'+(height?" width:"+width+";":"")+(height?" height:"+height+";":"")+'"></div>';
  if(url != undefined){
    if (hexo.config["post_asset_folder"] == true ){
      //for #10, if post_asset_folder is enable, regard url as relative url
      if (! (url.startsWith("https://") || url.startsWith("http://") || url.startsWith("/"))){
        var PostAsset = hexo.model('PostAsset');
        var asset = PostAsset.findOne({post: this._id, slug: url});
        if (!asset) return "bad asset path...";
        url = urlFn.resolve(hexo.config.root, asset.path);
      }
    }
    raw += '<script>var '+ id + ' = new DPlayer('+
      JSON.stringify({
        element: "document.getElementById('')",
        autoplay: autoplay,
        theme: theme,
        loop: loop,
        lang: ((lang == 'zh' | lang == 'en') ? lang : undefined),
        screenshot: screenshot,
        hotkey: hotkey,
        preload: preload,
        video: {
          url: url,
          pic: pic
        },
        danmaku: (api == undefined ? undefined :{
          api: api,
          id: did,
          token: token,
          maximum: maximum,
	  addition: (addition == undefined ? undefined : [addition] )
        })
      }).replace("\"document.getElementById('')\"",'document.getElementById("'+ id +'")') +
    ');</script>';
  }
  else{
    raw += '<p>no url specified, no dplayer _(:3」∠)_</p>';
  }
  return raw+mark;
});
