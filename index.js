/**
* hexo-tag-dplayer
* Embed DPlayer(https://github.com/DIYgod/DPlayer) in Hexo posts/pages.
* Syntax:
*  {% dplayer key=value ... %}
*/
'use strict';

const fs = require('hexo-fs'),
  util = require('hexo-util'),
  log = require('hexo-log')({name:"hexo-tag-dplayer",debug:false}), // logger
  urlFn = require('url'),
  path = require('path'),
  srcDir = path.dirname(require.resolve('dplayer')),
  scriptDir = '/assets/js/'; // default script directory

// DPlayer files to serve (CSS is bundled inside DPlayer.min.js since v1.26+)
var dplayerJsExists = false;
try {
  var dplayerJsPath = path.join(srcDir, 'DPlayer.min.js');
  fs.accessSync(dplayerJsPath, (fs.constants || fs).R_OK);
  dplayerJsExists = true;
} catch(e) {
  log.info('DPlayer.min.js is not found in this version of dplayer.');
}
  
var counter = 0,
  conf = hexo.config['hexo-tag-dplayer'] || {},
  tbIns=[];

// Compute DPlayer JS URL for both head injection and dynamic loading fallback
function getDPlayerJsUrl() {
  if (conf.cdn) {
    var cdn = Array.isArray(conf.cdn) ? conf.cdn : [conf.cdn];
    // Find the JS URL from CDN array
    for (var i = 0; i < cdn.length; i++) {
      if (cdn[i].endsWith('.js')) return cdn[i];
    }
    return cdn[0];
  }
  var root = hexo.config.root || '/';
  var jsPath = conf.js_path || scriptDir;
  return urlFn.resolve(root, path.posix.join(jsPath, 'DPlayer.min.js'));
}

var dplayerJsUrl = getDPlayerJsUrl();

if (!conf.cdn){
  var destPath = conf.js_path || scriptDir;
  var filePath = path.join(srcDir, 'DPlayer.min.js');

  if (dplayerJsExists) {
    var outputPath = path.posix.join(destPath, 'DPlayer.min.js');
    hexo.extend.generator.register(outputPath, function (_) {
      return {
        path: outputPath.replace(/^\//, ''),
        data: function() {
          return fs.createReadStream(filePath);
        }
      };
    });
    tbIns.push(outputPath);
  }
}

hexo.extend.filter.register('after_render:html', function (str, data) {
  if(str.includes('</html>') && str.includes('class="dplayer hexo-tag-dplayer-mark"')){ //make sure dplayer used in final html
    log.debug("got page that dplayer used");
    // Inject DPlayer JS into head (primary method for non-PJAX sites)
    // The inline tag script also has a dynamic loading fallback for PJAX
    if (!conf.cdn && dplayerJsExists) {
      var tag = util.htmlTag('script', {src: dplayerJsUrl}, '');
      str = str.replace(/<\/head>/, tag + '</head>');
    } else if (conf.cdn) {
      var cdn = Array.isArray(conf.cdn) ? conf.cdn : [conf.cdn];
      cdn.forEach(function(item) {
        if (item.endsWith('.js')) {
          var tag = util.htmlTag('script', {src: item}, '');
          str = str.replace(/<\/head>/, tag + '</head>');
        } else if (item.endsWith('.css')) {
          var tag = util.htmlTag('link', {rel: 'stylesheet', type: 'text/css', href: item });
          str = str.replace(/<\/head>/, tag + '</head>');
        } else if (item.endsWith('.map')) {
          // do nothing when source map used
        } else {
          log.info('unknown file type of dplayer cdn file:'+item);
        }
      });
    }
    return str;
  }
  return str;
})



// {% dplayer key=value ... %}
hexo.extend.tag.register('dplayer', function (args) {
  
  //hexo.locals.get('posts').forEach(console.log)

  const def = conf['default'] || {};
  //log.debug("default setting:"+def)
  
  var  id = 'dplayer' + (counter++), opt = {};
  
  for (var i in args) {
    var k = args[i].split('=')[0],
      v = args[i].split("=").length < 2 ? "true" : args[i].slice(args[i].indexOf('=')+1);
    if (['autoplay', 'loop', 'screenshot', 'hotkey', 'mutex', 'dmunlimited'].indexOf(k) >= 0){
      // bool
      v = v.toLowerCase();
      opt[k] = ['true', 'yes', '1', 'y', 'on', ''].indexOf(v) >= 0;
    } else if (['preload', 'theme', 'lang', 'logo', 'url', 'pic', 'thumbnails', 'vidtype', 'suburl', 'subtype', 'subbottom', 'subcolor', 'subcolor', 'id', 'api', 'token', 'addition', 'dmuser', 'width', 'height', 'code'].indexOf(k) >= 0){
      // string
      opt[k] = v.toString();
    } else if (['volume', 'maximum'].indexOf(k) >= 0){
      // number
      opt[k] = Number(v) || undefined;
    } else if (['yet not implemented'].indexOf(k) >= 0){
      // native
      continue;
    }
  }
  
  const width = opt.width || def.width,
    height = opt.height || def.height;
  var url = opt.url || def.url;
  // Build responsive style: max-width prevents overflow on mobile (#31)
  var containerStyle = 'margin-bottom: 20px;max-width:100%';
  if (width) containerStyle += ';width:' + width;
  if (height) containerStyle += ';height:' + height;
  var raw =  '<div id="'+ id + '" class="dplayer hexo-tag-dplayer-mark" style="' + containerStyle + '"></div>';
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
    raw += '<script>(function(){' +
      'var dplayerConfig = ' +
      JSON.stringify({
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
        if (typeof v === 'string') {
          if (v !== "document.getElementById('')"){
            var val = opt[v];
            return (val !== undefined && val !== null) ? val : def[v];
          } else {
            return v;
          }
        } else if (k === "subtitle" && !(opt.suburl || def.suburl)) {
          return undefined;
        } else if (k === "danmaku" && !(opt.api || def.api)) {
          return undefined;
        } else if (k === "addition" && !(opt.addition || def.addition)) {
          return undefined;
        } else {
          return v;
        }
      }).replace("\"document.getElementById('')\"",'document.getElementById("'+ id +'")') +
    ';' +
    'var __dpInit=function(){' +
      'var player = new DPlayer(dplayerConfig);' +
      'window.dplayers||(window.dplayers=[]);' +
      'window.dplayers.push(player);' +
      (opt.code || def.code || '') +
    '};' +
    'if(typeof DPlayer!=="undefined"){' +
      '__dpInit();' +
    '}else{' +
      'var __dpScript=document.createElement("script");' +
      '__dpScript.src="' + dplayerJsUrl + '";' +
      '__dpScript.onload=__dpInit;' +
      '__dpScript.onerror=function(){console.error("Failed to load DPlayer from ' + dplayerJsUrl + '");};' +
      'document.head.appendChild(__dpScript);' +
    '}' +
    '})()</script>';
    //console.log(opt.code,def.code,(opt.code || def.code || ''));
  }
  else{
    raw += '<p>no url specified, no dplayer _(:3」∠)_</p>';
  }
  return raw;
});
