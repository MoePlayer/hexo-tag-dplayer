# hexo-tag-dplayer
本项目是将diygod的dplayer运行在hexo的插件

感谢关注这个插件的人们，感谢aplayer的hexo插件作者@grzhan，感谢A or D播放器作者@Diygod
感谢插件豆子@dixyes的移植
借鉴项目：https://github.com/grzhan/hexo-tag-aplayer
这个项目的两个维护者一个只会卖萌，一个又很忙(这是豆子)
所以有什么bug很长时间没解决的，请谅解
如果您能修复的话，也希望请您修复一下提交个pr什么的，祝君安康


---------------------------------------------



Embed DPlayer([https://github.com/DIYgod/DPlayer](https://github.com/DIYgod/DPlayer)) in Hexo posts/pages.

![plugin screenshot](https://static.morz.org/data/img/2016-05-24-07-31.png)



## npm install

	npm install hexo-tag-dplayer --save

## Usage

	{% dplayer key=value ... %}

key can be 

	'autoplay': will play automatic or not
	'loop': will loop or not
	'url': video source url
	'pic': video cover picture
	'api': DPlayer danmaku backend url
	'id': see https://github.com/DIYgod/DPlayer
	'token': see https://github.com/DIYgod/DPlayer

for example:

	{% dplayer "url=http://devtest.qiniudn.com/若能绽放光芒.mp4" "api=http://dplayer.daoapp.io" "pic=http://devtest.qiniudn.com/若能绽放光芒.png" "id=9E2E3368B56CDBB4" "loop=yes" "theme=#FADFA3" "autoplay=false" "token=tokendemo" %}

## Customization

You can modify variables `scriptDir`(default: "/assets/js/" ) and `styleDir`(default: "/assets/css/") in `index.js` according to your blog's directory structure.

## Todo

- [x] Publish it to the [hexo plugin list](https://hexo.io/plugins) and npm

## LICENSE

MIT
