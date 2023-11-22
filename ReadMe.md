# Virtual BIT Network

[BIT WebVPN](https://webvpn.bit.edu.cn) 登录与转换。

```shell
> npm install YDX-2147483647/virtual-BIT-network  # from GitHub
```

## 程序界面

```typescript
import VirtualBIT, { cli } from 'virtual-bit-network'

const proxy = new VirtualBIT({ username, password })
await proxy.sign_in(cli.display_captcha_then_ask_from_command_line({ width: '80%' }))

const response = await proxy.fetch('dzb.bit.edu.cn')
```

`VirtualBIT.fetch()`会自动转换 URL，添加 cookie。

## CLI 命令行界面

```shell
> npm exec virtual-bit-network  # or `npm exec bit-webvpn`
? username: 1120○○○○○○
? password: [input is hidden]
✓ Signed in.
? Test which website? (eg. dzb.bit.edu.cn) dzb.bit.edu.cn
Got “北京理工大学党委办公室/行政办公室”.
```

由于网站规定，连续输错三次及以上，一般会需要验证码。

![验证码图像被直接显示到终端](https://s2.loli.net/2022/08/03/zQxtpAW5jrwV918.jpg)

## 严重参考

- [spencerwooo/bit-webvpn-converter](https://github.com/spencerwooo/bit-webvpn-converter)（未明确许可）

  - [lib/convert.ts](https://github.com/spencerwooo/bit-webvpn-converter/blob/1c94647e9e6e9fe3ce3e6fd43ffde70e10127f48/lib/convert.ts)

- [flwfdd/BIT101](https://github.com/flwfdd/BIT101)（MIT License）
  - [登录流程](https://github.com/flwfdd/BIT101/blob/e196258e6048db798baeaeb8a03d098ae7ca4479/doc/README.md#%E5%AD%A6%E6%A0%A1%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E7%99%BB%E5%BD%95%E6%B5%81%E7%A8%8B)
  - 相关代码
    - [src/utils/tools.ts](https://github.com/flwfdd/BIT101/blob/e196258e6048db798baeaeb8a03d098ae7ca4479/src/utils/tools.ts)
    - [backend/webvpn.py](https://github.com/flwfdd/BIT101/blob/e196258e6048db798baeaeb8a03d098ae7ca4479/backend/webvpn.py)
    - [backend/user.py](https://github.com/flwfdd/BIT101/blob/e196258e6048db798baeaeb8a03d098ae7ca4479/backend/user.py)

## 可能遇到的问题

`VirtualBIT.prototype.fetch`只转换 URL，添加 cookie，除此以外什么也不做。——这无法解决全部问题。

### 具体案例：“数学实验中心”通知

> 前方玄学。

- mec（数学实验中心）新闻公告的 API 会检查请求头的 Referer，必须在 mec.bit.edu.cn 下才行。

  （`encrypt_URL`转换后的也可以，但 https://webvpn.bit.edu.cn 本身不行。）

- 校内可直接访问。

- 校外直接访问会炸。

- （校外）若先用`proxy.fetch`访问任意网址，就能正常访问了。

  “任意网址”可以是 dzb（党政部）、百度、必应，甚至 [mec 主站](http://mec.bit.edu.cn)！

- 若把“访问任意网址”换成延时，仍无法正常访问。

下面这段程序会打印 mec 某则通知的标题。

> 需要先设置`username`、`password`。

```typescript
import VirtualBIT, { cli, encrypt_URL } from './index.js'

const proxy = new VirtualBIT({ username, password })
await proxy.sign_in(cli.display_captcha_then_ask_from_command_line({ width: '80%' }))

// ↓玄学
await proxy.fetch('http://dzb.bit.edu.cn/')

await proxy.fetch('http://mec.bit.edu.cn/pcmd/ajax.php?vpn-12-o1-mec.bit.edu.cn&act=getmanage_nologin&w=新闻公告', {
  headers: {
    Referer: encrypt_URL('http://mec.bit.edu.cn'),
  },
}).then(r => r.json())
  // @ts-ignore
  .then(json => console.log(json.data.data[0].jmtitle))

// 输出示例：
// 2022年全国大学生数学建模竞赛报名通知（8月5日更新）
```

