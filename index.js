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
  mark = '<!-- dplayer used1 -->',
  scriptDir = '/assets/js/', //change this to change js and css dir
  styleDir = '/assets/css/',
  files = [
    ['DPlayer.min.css', styleDir],
    ['DPlayer.min.js', scriptDir],
    // some map for debug use
    //['DPlayer.min.css.map', styleDir],
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
  conf = hexo.config['hexo-tag-dplayer'] || {},
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
        console.log('INFO  hexo-tag-dplayer: '+item[0]+' is not found in this version of dplayer, skip it.');
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
      s = str.replaceAll(mark,'');
    target.forEach(item => {
      if (item.endsWith('.css')) {
        var tag = util.htmlTag('link', {rel: 'stylesheet', type: 'text/css', href: item }, '');
        s = s.substring(0,s.lastIndexOf('</body>'))+tag+s.substring(str.lastIndexOf('</body>'));
      }else if (item.endsWith('.js')) {
        var tag = util.htmlTag('script', {src: item}, '');
        s = s.substring(0,s.indexOf('</head>'))+tag+s.substring(str.indexOf('</head>'));
      }else if (item.endsWith('.map')) {
        //do nothing when sorce map used
      }else{
        console.log('INFO hexo-tag-dplayer: unknown tile type of cdnfile:'+item);
      }
    })
    //console.log(s)
    return s;
  }
})



// {% dplayer key=value ... %}
hexo.extend.tag.register('dplayer', (args) => {

  const conf = (hexo.config['hexo-tag-dplayer'] || {})['default'] || {};
  
  var  id = 'dplayer' + (counter++), opt = {};
  
  for (var i in args) {
    var k = args[i].split('=')[0],
      v = args[i].slice(args[i].indexOf('=')+1);
    if (['autoplay', 'loop', 'screenshot', 'hotkey', 'mutex', 'dmunlimited'].indexOf(k) >= 0){
      // bool
      v = v.toLowerCase();
      opt[k] = ['true', 'yes', '1', 'y', 'on', true].indexOf(v) >= 0;
    } else if (['preload', 'theme', 'lang', 'logo', 'url', 'pic', 'thumbnails', 'vidtype', 'suburl', 'subtype', 'subbottom', 'subcolor', 'subcolor', 'id', 'api', 'token', 'addition', 'dmuser', 'width', 'height', 'code'].indexOf(k) >= 0){
      // string
      opt[k] = v;
    } else if (['volume', 'maximum'].indexOf(k) >= 0){
      // number
      opt[k] = Number(v) || undefined;
    } else if (['yet not implemented'].indexOf(k) >= 0){
      // native
      continue;
    }
  }
  
  const width = opt.width || conf.width,
    height = opt.height || conf.height;
  var url = opt.url || conf.url;
  var raw =  '<div id="'+ id + '" class="dplayer" style="margin-bottom: 20px;'+(width ?' width:'+width+';':'')+(height?' height:'+height+';':'')+'"></div>';
  if(url != undefined){
    if (hexo.config['post_asset_folder'] == true ){
      //for #10, if post_asset_folder is enable, regard url as relative url
      if (! (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('/'))){
        var PostAsset = hexo.model('PostAsset');
        var asset = PostAsset.findOne({post: this._id, slug: url});
        if (!asset) return 'bad asset path...';
        opt.url = urlFn.resolve(hexo.config.root, asset.path);
      }
    }
    raw += '<script>var player = new DPlayer(' +
      JSON.stringify({
        //element: "document.getElementById('')",
        container: "document.getElementById('')",
        autoplay: 'autoplay',
        theme: 'theme',
        loop: 'loop',
        lang: 'lang',
        screenshot: 'screenshot',
        hotkey: 'hotkey',
        preload: 'preload',
        logo: 'logo',
        volume: 'volume',
        mutex: 'mutex',
        video: {
            url: 'url',
            pic: 'pic',
            thumbnails: 'thumbnails',
            type: 'vidtype',
        },
        subtitle: {
            url: 'suburl',
            type: 'subtype',
            fontSize: 'subsize',
            bottom: 'subbottom',
            color: 'subcolor',
        },
        danmaku: {
            id: 'id',
            api: 'api',
            token: 'token',
            maximum: 'maximum',
            addition: ['addition'],
            user: 'dmuser',
            unlimited: 'dmunlimited',
        },
        icons: 'icons',
        contextmenu: 'menu',
      },(k,v)=>{
        //console.log("k",k,"v",v,"?",opt[k],"?a", conf[k])
        if (typeof v === 'string') {
          if (v !== "document.getElementById('')"){
            return opt[v] || conf[v];
          } else {
            return v;
          }
        } else if (k === "subtitle" && !(opt.suburl || conf.suburl)) {
          return undefined;
        } else if (k === "danmaku" && !(opt.api || conf.api)) {
          return undefined;
        } else {
          return v;
        }
      }).replace("\"document.getElementById('')\"",'document.getElementById("'+ id +'")') +
    ');' + (opt.code || conf.code || '') + '</script>';
    //console.log(opt.code,conf.code,(opt.code || conf.code || ''))
  }
  else{
    raw += '<p>no url specified, no dplayer _(:3」∠)_</p>';
  }
  return raw+mark;
});
