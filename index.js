/**
* hexo-tag-dplayer
* https://github.com/NextMoe/hexo-tag-dplayer
* Transplant recipients : dixyes
* Integrated source protocol 
* ---------------------------------
* source item
* hexo-tag-aplayer
* https://github.com/grzhan/hexo-tag-aplayer
* Copyright (c) 2016, grzhan
* Licensed under the MIT license.
* ---------------------------------
* Syntax:
*  {% dplayer key=value ... %}
*/
'use strict'
var fs = require('hexo-fs'),
  util = require('hexo-util'),
  path = require('path'),
  counter = 0,
  srcDir = path.dirname(require.resolve('dplayer')),
  scriptDir = 'assets/js/', //change this and below to change js and css dir
  styleDir = 'assets/css/',
  dplayerScript = 'DPlayer.min.js',
  dplayerStyle = 'DPlayer.min.css',
  registers = [
    [dplayerStyle, styleDir + dplayerStyle, path.join(srcDir, dplayerStyle)],
    [dplayerScript, scriptDir + dplayerScript, path.join(srcDir, dplayerScript)],
  ];

for (var i = 0; i < registers.length; ++i) {
  (function (i) {
    var register = registers[i], regName = register[0],
      pubPath = register[1], srcPath = register[2];
    if(fs.existsSync(srcPath))
        hexo.extend.generator.register(regName, function(locals) {
          return {
            path: pubPath,
            data: function() {
              return fs.createReadStream(srcPath);
            }
          };
        });
  })(i);
}

hexo.extend.filter.register('after_post_render', function(data) {
  if (hexo.render.getOutput(data.source)=='html')
    data.content =
      (fs.existsSync(path.join(srcDir, dplayerStyle)) ? util.htmlTag('link', {rel: 'stylesheet', type: 'text/css', href: '/' + styleDir + dplayerStyle }) : '') +
      util.htmlTag('script', {src: '/' + scriptDir + dplayerScript}, " ") +
      data.content;
  return data;
});

// {% dplayer key=value ... %}
hexo.extend.tag.register('dplayer', function(args) {
  let  url, api, loop, autoplay, theme, pic, did, token, screenshot, lang, maximum, hotkey, preload, width, height, addition;
  var  id = 'dplayer' + (counter++);
  for (var i = 0; i < args.length; ++i) {
    var arg=args[i];
    if(arg.split('=').length<2)
        continue;
    switch(arg.split('=')[0]){
      case 'autoplay':
        if(arg.split('=')[1]=='true'||arg.split('=')[1]=='yes'||arg.split('=')[1]=='1')
            autoplay = true;
        else
            autoplay = false;
        break;
      case 'theme':
        theme = arg.slice(arg.indexOf("=")+1);
        break;
      case 'loop':
        if(arg.split('=')[1]=='true'||arg.split('=')[1]=='yes'||arg.split('=')[1]=='1')
            loop = true;
        else
            loop = false;
        break;
      case 'lang':
        lang = arg.slice(arg.indexOf("=")+1);
        break;
      case 'screenshot':
        if(arg.split('=')[1]=='true'||arg.split('=')[1]=='yes'||arg.split('=')[1]=='1')
          screenshot = true;
        else
          screenshot = false;
        break;
      case 'hotkey':
        if(arg.split('=')[1]=='true'||arg.split('=')[1]=='yes'||arg.split('=')[1]=='1')
          hotkey = true;
        else
          hotkey = false;
        break;
      case 'preload':
        preload = arg.slice(arg.indexOf("=")+1);
        break;
      case 'url':
        url = arg.slice(arg.indexOf("=")+1);
        break;
      case 'pic':
        pic = arg.slice(arg.indexOf("=")+1);
        break;
      case 'api':
        api = arg.slice(arg.indexOf("=")+1);
        break;
      case 'id':
        did = arg.slice(arg.indexOf("=")+1);
        break;
      case 'token':
        token = arg.slice(arg.indexOf("=")+1);
        break;
      case 'maximum':
        maximum = arg.slice(arg.indexOf("=")+1);
        break;
      case 'width':
        width = arg.slice(arg.indexOf("=")+1);
        break;
      case 'height':
        height = arg.slice(arg.indexOf("=")+1);
        break;
      case 'addition':
        addition = arg.slice(arg.indexOf("=")+1);
        break;
    }
  }
  var raw =  '<div id="'+ id + '" class="dplayer" style="margin-bottom: 20px;'+(height?" width:"+width+";":"")+(height?" height:"+height+";":"")+'"></div>';
  if(url != undefined)
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
	  addition: [addition]
        })
      }).replace("\"document.getElementById('')\"",'document.getElementById("'+ id +'")') +
    ');</script>';
  else
    raw += '<p>no url specified, no dplayer _(:3」∠)_</p>';
  return raw;
});
