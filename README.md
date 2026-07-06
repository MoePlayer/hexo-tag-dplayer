# hexo-tag-dplayer

Embed [DPlayer](https://github.com/DIYgod/DPlayer) in Hexo posts/pages via a simple tag syntax.

> 本项目是将 DIYgod 的 DPlayer 嵌入 Hexo 的标签插件  
> 原始作者: [@dixyes](https://github.com/dixyes), 借鉴 [hexo-tag-aplayer](https://github.com/grzhan/hexo-tag-aplayer)  
> 感谢 DPlayer 作者 [@DIYgod](https://github.com/DIYgod)、hexo-tag-aplayer 作者 [@grzhan](https://github.com/grzhan)  
> 当前版本由 AI (GitHub Copilot) 重构修复

[📺 在线示例](https://moeplayer.github.io/hexo-tag-dplayer/example/) | [示例源码](example/index.html)



## Install

```bash
npm install hexo-tag-dplayer --save
```

## Usage

在文章中使用 `{% dplayer %}` 标签嵌入视频播放器:

```
{% dplayer "url=视频地址" "pic=封面图" "key=value" ... %}
```

### 参数说明

| 类型 | 参数名 | 说明 |
|------|--------|------|
| **布尔** | `autoplay` `loop` `screenshot` `hotkey` `mutex` `dmunlimited` | 不带值或 `=yes`/`=true`/`=1` 启用，`=false`/`=no` 关闭 |
| **字符串** | `url` `pic` `thumbnails` `vidtype` | 视频地址、封面图、缩略图、视频类型 |
| **字符串** | `suburl` `subtype` `subbottom` `subcolor` `subsize` | 字幕地址、字幕类型、底部距离、颜色、字体大小 |
| **字符串** | `id` `api` `token` `addition` `dmuser` | 弹幕 ID、弹幕 API、Token、额外数据、弹幕用户名 |
| **字符串** | `theme` `lang` `logo` `preload` | 主题色、语言、Logo、预加载 |
| **数字** | `volume` `maximum` | 默认音量 (0-1)、最大弹幕数 |
| **样式** | `width` `height` | 播放器宽高 (如 `800px`, `100%`) |
| **脚本** | `code` | 附加到初始化后的 JavaScript 代码 |

### 参数到 DPlayer 配置的映射

```js
{
    autoplay:   'autoplay',    // 自动播放
    theme:      'theme',       // 主题色
    loop:       'loop',        // 循环播放
    lang:       'lang',        // 语言
    screenshot: 'screenshot',  // 截图
    hotkey:     'hotkey',      // 快捷键
    preload:    'preload',     // 预加载
    logo:       'logo',        // Logo
    volume:     'volume',      // 音量
    mutex:      'mutex',       // 互斥播放
    video: {
        url:        'url',         // 视频地址
        pic:        'pic',         // 封面图
        thumbnails: 'thumbnails',  // 缩略图
        type:       'vidtype',     // 视频类型 (auto/hls/flv/mp4)
    },
    subtitle: {
        url:      'suburl',     // 字幕地址
        type:     'subtype',    // 字幕类型 (webvtt/srt)
        fontSize: 'subsize',    // 字幕字体大小
        bottom:   'subbottom',  // 字幕底部距离
        color:    'subcolor',   // 字幕颜色
    },
    danmaku: {
        id:        'id',          // 弹幕池 ID
        api:       'api',         // 弹幕 API 地址
        token:     'token',       // 弹幕 API Token
        maximum:   'maximum',     // 最大弹幕数
        addition:  ['addition'],  // 额外弹幕数据
        user:      'dmuser',      // 弹幕用户名
        unlimited: 'dmunlimited', // 无限弹幕
    },
}
```

### 示例

**基础视频播放:**

```
{% dplayer "url=https://example.com/video.mp4" "pic=https://example.com/cover.jpg" %}
```

**带弹幕的视频:**

```
{% dplayer "url=https://example.com/video.mp4" "id=myVideoId" "api=https://api.prprpr.me/dplayer/" "pic=https://example.com/cover.jpg" "loop=yes" "theme=#FADFA3" "autoplay=false" "token=mytoken" %}
```

**带字幕的视频:**

```
{% dplayer "url=https://example.com/video.mp4" "suburl=https://example.com/sub.vtt" "subtype=webvtt" "subbottom=10%" "subcolor=#fff" %}
```

**自定义代码注入:**

```
{% dplayer 'url=some.mp4' "api=https://api.prprpr.me/dplayer/" 'code=player.on("loadstart",function(){console.log("视频开始加载")})' "autoplay" %}
```

**指定播放器尺寸:**

```
{% dplayer "url=https://example.com/video.mp4" "width=800px" "height=500px" %}
```

**本地视频 (需开启 post_asset_folder):**

```
{% dplayer "url=my-video.mp4" %}
```

> **注意:** `id` `api` `maximum` `addition` `dmuser` `dmunlimited` 等弹幕参数仅在设置了 `api` 时生效。`suburl` `subtype` 等字幕参数仅在设置了 `suburl` 时生效。
>
> 播放器容器默认带有 `max-width:100%` 样式，在移动端不会溢出。 


## PJAX 兼容

插件已内置动态脚本加载机制：当检测到 `DPlayer` 未定义时，会自动异步加载 DPlayer.js 后再初始化播放器。

如果你的主题使用 PJAX，建议在主题中添加以下代码来正确销毁旧播放器实例:

```js
$(document).on('pjax:before', function () {
    if (window.dplayers) {
        for (var i = 0; i < window.dplayers.length; i++) {
            window.dplayers[i].destroy();
        }
        window.dplayers = [];
    }
});
```

## 配置

在 Hexo 站点的 `_config.yml` 中配置:

```yaml
hexo-tag-dplayer:
  # DPlayer JS 文件输出路径 (默认 /assets/js/)
  js_path: /assets/js/

  # 使用 CDN 加载 DPlayer (设置后将忽略本地 js_path)
  # cdn:
  #   - https://cdn.jsdelivr.net/npm/dplayer/dist/DPlayer.min.js

  # 默认标签参数 (所有 {% dplayer %} 标签的默认值)
  default:
    api: https://api.prprpr.me/dplayer/
    theme: '#FADFA3'
    autoplay: false
    # 其他 DPlayer 选项...
```

> **注意:** DPlayer 1.26+ 已将 CSS 内联打包到 JS 文件中，因此不再需要 `css_path` 配置项。

## 高级: 使用 Raw 模式

如果标签语法无法满足需求，可以使用 Hexo 的 `raw` 标签直接编写 DPlayer 初始化代码:

```
{% raw %}
<div id="player1" class="dplayer"></div>
<script src="/assets/js/DPlayer.min.js"></script>
<script>
var dp = new DPlayer({
    container: document.getElementById('player1'),
    autoplay: false,
    theme: '#FADFA3',
    loop: true,
    screenshot: true,
    hotkey: true,
    volume: 0.7,
    video: {
        url: 'demo.mp4',
        pic: 'demo.png',
        type: 'auto'
    },
    subtitle: {
        url: 'subtitle.vtt',
        type: 'webvtt',
        fontSize: '25px',
        bottom: '10%',
        color: '#b7daff'
    },
    danmaku: {
        id: 'demo',
        api: 'https://api.prprpr.me/dplayer/',
        token: 'demo',
        maximum: 3000,
        user: 'DIYgod'
    },
    contextmenu: [
        {
            text: 'custom',
            link: 'https://github.com/MoePlayer/DPlayer'
        }
    ]
});
</script>
{% endraw %}
```

详见 [DPlayer 文档](https://github.com/DIYgod/DPlayer)。

## 开发

```bash
git clone https://github.com/MoePlayer/hexo-tag-dplayer.git
cd hexo-tag-dplayer
npm install
npm test          # 运行单元测试 (28 cases)
npm run test:coverage  # 测试覆盖率
```

## Changelog

### v0.3.4 (2026-07-07)

- 修复 DPlayer 1.26+ 版本 CSS 文件缺失导致的 `DPlayer.min.css is not found` 警告 (#35)
- 移除有问题的 `String.prototype.replaceAll` polyfill，修复调用栈溢出 (#38)
- 修复子路径部署时资源路径计算错误 (#23)
- 添加 DPlayer 动态加载回退机制，解决 PJAX 场景 `DPlayer is not defined` (#17, #39)
- 播放器容器添加 `max-width:100%`，修复移动端宽度溢出 (#31)
- 修复布尔值 `false` 被 `||` 操作符错误丢弃的问题
- 添加单元测试 (28 cases, 覆盖率 72.8%)

## License

MIT
