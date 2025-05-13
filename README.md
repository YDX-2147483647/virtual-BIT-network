# Virtual BIT Network

[![NPM Version](https://img.shields.io/npm/v/virtual-bit-network)](https://www.npmjs.com/package/virtual-bit-network)
[![JSR Version](https://img.shields.io/jsr/v/%40ydx/virtual-bit-network)](https://jsr.io/@ydx/virtual-bit-network)

> [!CAUTION]
> [2025年5月10日学校统一身份认证系统升级](https://itc.bit.edu.cn/tzgg/997be9f3c1fe4c26a33285f60d3003dc.htm)，目前已适配登录。
>
> 不过现在验证码机制比较复杂（附带 CSRF 键值对才能检查是否需要验证码）。考虑到其用处不大，目前删除了相关功能。

[BIT WebVPN](https://webvpn.bit.edu.cn) 登录与转换。

```shell
> npm install YDX-2147483647/virtual-BIT-network  # from GitHub
```

## 程序界面

```typescript
import VirtualBIT from 'virtual-bit-network'

const proxy = new VirtualBIT({ username, password })
await proxy.sign_in()

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

由于网站规定，连续输错三次及以上，一般会需要验证码。此时很遗憾，并不支持登录。

<!-- ![验证码图像被直接显示到终端](https://s2.loli.net/2022/08/03/zQxtpAW5jrwV918.jpg) -->

## 严重参考

- [spencerwooo/bit-webvpn-converter](https://github.com/spencerwooo/bit-webvpn-converter)（未明确许可）

  - [lib/convert.ts](https://github.com/spencerwooo/bit-webvpn-converter/blob/1c94647e9e6e9fe3ce3e6fd43ffde70e10127f48/lib/convert.ts)

- [flwfdd/BIT101](https://github.com/flwfdd/BIT101)（MIT License）
  - [登录流程](https://github.com/flwfdd/BIT101/blob/e196258e6048db798baeaeb8a03d098ae7ca4479/doc/README.md#%E5%AD%A6%E6%A0%A1%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E7%99%BB%E5%BD%95%E6%B5%81%E7%A8%8B)（2022年）
  - [支持学校的新的统一身份认证 by NylteJ · Pull Request #14 · BIT101-dev/BIT101-Android](https://github.com/BIT101-dev/BIT101-Android/pull/14)（2025年）

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
import VirtualBIT, { encrypt_URL } from './index.js'

const proxy = new VirtualBIT({ username, password })
await proxy.sign_in()

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
// 2025年北京理工大学数学建模竞赛第二轮赛题(0502有更正)
```

