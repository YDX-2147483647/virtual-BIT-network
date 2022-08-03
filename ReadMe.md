# Virtual BIT Network

[BIT WebVPN](webvpn.bit.edu.cn) 登录与转换。

## CLI 命令行界面

```powershell
> npm run build
> node ./dist/cli.js
? username: 1120○○○○○○
? password: [input is hidden]
✓ Signed in.
? Test which website? (eg. dzb.bit.edu.cn) dzb.bit.edu.cn
Got “北京理工大学党委办公室/行政办公室”.
```

由于网站规定，连续输错三次及以上，一般会需要验证码。

![验证码图像被直接显示到终端](https://s2.loli.net/2022/08/03/zQxtpAW5jrwV918.jpg)

## 严重参考

- [spencerwooo/bit-webvpn-converter](https://github.com/spencerwooo/bit-webvpn-converter)

  - [lib/convert.ts](https://github.com/spencerwooo/bit-webvpn-converter/blob/1c94647e9e6e9fe3ce3e6fd43ffde70e10127f48/lib/convert.ts)

- [flwfdd/BIT101](https://github.com/flwfdd/BIT101)
  - [登录流程](https://github.com/flwfdd/BIT101/blob/e196258e6048db798baeaeb8a03d098ae7ca4479/doc/README.md#%E5%AD%A6%E6%A0%A1%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E7%99%BB%E5%BD%95%E6%B5%81%E7%A8%8B)
  - 相关代码
    - [src/utils/tools.ts](https://github.com/flwfdd/BIT101/blob/e196258e6048db798baeaeb8a03d098ae7ca4479/src/utils/tools.ts)
    - [backend/webvpn.py](https://github.com/flwfdd/BIT101/blob/e196258e6048db798baeaeb8a03d098ae7ca4479/backend/webvpn.py)
    - [backend/user.py](https://github.com/flwfdd/BIT101/blob/e196258e6048db798baeaeb8a03d098ae7ca4479/backend/user.py)

> 这两个项目都未明确许可，因此这里暂时也不明确许可。
