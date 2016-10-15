# hexo-tag-dplayer
本项目是将diygod的dplayer运行在hexo的插件

感谢关注这个插件的人们，感谢aplayer的hexo插件作者@grzhan，感谢A or D播放器作者@Diygod

感谢插件豆子@dixyes的移植

借鉴项目：https://github.com/grzhan/hexo-tag-aplayer

这个项目的两个维护者一个只会卖萌，一个又沉迷屁股(这是豆子)

所以有什么bug很长时间没解决的，请谅解

如果您能修复的话，也希望请您修复一下提交个pr什么的，祝君安康


---------------------------------------------



Embed DPlayer([https://github.com/DIYgod/DPlayer](https://github.com/DIYgod/DPlayer)) in Hexo posts/pages.

[Hexo Demo](https://morz.org/archives/2016-09-09/%E8%A7%86%E9%A2%91%E5%88%86%E4%BA%AB-%E3%80%90%E6%9D%B1%E6%96%B9Vocal%E3%80%91%E8%8A%B1%E6%98%A0%E3%80%8C%E3%82%BF%E3%83%9E%E3%82%B7%E3%82%A4%E3%83%8E%E3%83%8F%E3%83%8A%E3%80%8D-%E5%87%8B%E5%8F%B6%E6%A3%95-%E3%80%8CSubbed%E3%80%8D.html)

![plugin screenshot](https://video-cache.morz.org/data/img/dplayer-1.jpg)



## npm install

	npm install hexo-tag-dplayer --save

## Usage

	{% dplayer key=value ... %}

key can be 

	'autoplay': autoplay video, not supported by mobile browsers
    'theme': theme color, default: #b7daff
	'loop': loop play music, default: true
    'lang': language, `zh` for Chinese, `en` for English, default: Navigator language
    'screenshot':  enable screenshot function, default: false, NOTICE: if set it to true, video and video poster must enable Cross-Origin
	'hotkey': binding hot key, including left right and Space, default: true
    'preload': 'auto', the way to load music, can be 'none' 'metadata' 'auto', default: 'auto'
    'url': Required, video url
	'pic': video cover picture
	'api': DPlayer danmaku backend url
	'addition': Dplayer danmuku for bilibili 
	'id': see https://github.com/DIYgod/DPlayer
	'token': see https://github.com/DIYgod/DPlayer
    'maximum': maximum quantity of danmaku
    
    'width' maximum width of the dplayer wraper
    'height' maximum height of the dplayer wraper, you can use this like "height=233px"

for example:

	{% dplayer "url=http://devtest.qiniudn.com/若能绽放光芒.mp4" "addition=https://dplayer.daoapp.io/bilibili?aid=4157142" "api=http://dplayer.daoapp.io" "pic=http://devtest.qiniudn.com/若能绽放光芒.png" "id=9E2E3368B56CDBB4" "loop=yes" "theme=#FADFA3" "autoplay=false" "token=tokendemo" %}
    {% dplayer "url=http://devtest.qiniudn.com/若能绽放光芒.mp4" "addition=https://dplayer.daoapp.io/bilibili?aid=4157142" "api=http://dplayer.donot.help/dplayerpy" "pic=http://devtest.qiniudn.com/若能绽放光芒.png" "id=2622668" "loop=yes" "theme=#FADFA3" "autoplay=false" "width=233px" %}

## Customization

You can modify variables `scriptDir`(default: "/assets/js/" ) and `styleDir`(default: "/assets/css/") in `index.js` according to your blog's directory structure.

## Issue

If any issue occurs, tell me via issue, use a hexo raw tag like below to use dplayer:

    {% raw %}
    <div id="player1" class="dplayer"></div>
    <script src="dist/DPlayer.min.js"></script><!-- use your path -->
    <script>
    var option = {
        element: document.getElementById('player1'),                       // Optional, player element
        autoplay: false,                                                   // Optional, autoplay video, not supported by mobile browsers
        theme: '#FADFA3',                                                  // Optional, theme color, default: #b7daff
        loop: true,                                                        // Optional, loop play music, default: true
        lang: 'zh',                                                        // Optional, language, `zh` for Chinese, `en` for English, default: Navigator language
        screenshot: true,                                                  // Optional, enable screenshot function, default: false, NOTICE: if set it to true, video and video poster must enable Cross-Origin
        hotkey: true,                                                      // Optional, binding hot key, including left right and Space, default: true
        preload: 'auto',                                                   // Optional, the way to load music, can be 'none' 'metadata' 'auto', default: 'auto'
        video: {                                                           // Required, video info
            url: '若能绽放光芒.mp4',                                         // Required, video url
            pic: '若能绽放光芒.png'                                          // Optional, music picture
        },
        danmaku: {                                                         // Optional, showing danmaku, ignore this option to hide danmaku
            id: '9E2E3368B56CDBB4',                                        // Required, danmaku id, NOTICE: it must be unique, can not use these in your new player: `https://dplayer.daoapp.io/list`
            api: 'https://dplayer.daoapp.io/',                             // Required, danmaku api
            token: 'tokendemo',                                            // Optional, danmaku token for api
            maximum: 1000                                                  // Optional, maximum quantity of danmaku
	    addition: ['https://dplayer.daoapp.io/bilibili?aid=4157142']   // Optional, additional danmaku, see: `Bilibili 弹幕支持`
        }
    }
    var dp = new DPlayer(option);
    </script>
    {% endraw %}
    
see [DPlayer](https://github.com/DIYgod/DPlayer) for usage detail

## Todo

- [x] Publish it to the [hexo plugin list](https://hexo.io/plugins) and npm

## LICENSE

MIT
