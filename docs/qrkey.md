## 密钥二维码

密钥二维码是由客户端随机生成用于加密账号和密码等敏感信息的字符串。

### 组成

密钥二维码由`key`、`vi`、`code`三部分组成。其中`key`和`vi`完全由客户端随机生成，是用于加密敏感信息的主要参数。`code`则是由服务端生成，用于对密钥的合法性做认定。

### 特点

* 本地生成
* 不上传服务端
* 丢失无法找回


### 生成

参考小程序内代码文件`/miniprogram/magics/qrKeyManage.js`

> 整个过程进行了1次服务端交互，0个数据提交，2个数据返回，2个数据参与加密

1. 首先客户端需要约定两个固定加密参数`qr_key_plain`和`qr_vi_plain`

2. 对以上两个参数MD5加密输出HEX(大写)形成`qr_crypto_key`和`qr_crypto_vi`

3. 请求服务端生成密钥串合法识别码`qr_key_auth_code` 和 `qr_key_auth_vi`

4. 本地生成两个加密参数`qr_key`、`qr_vi`。用作对密码等敏感信息的客户端加密

5. 将以上两个参数以下述格式转化为json字符串`qr_crypto_object_str`

```
{
  "key": qr_key,
  "vi": qr_vi
}
```

6. 使用`qr_key_auth_code` 和 `qr_key_auth_vi` 做MD5加密输出HEX(大写)形成 `qr_crypto_object_key`和`qr_crypto_object_vi`

7. 使用`qr_crypto_object_key`和`qr_crypto_object_vi` 对 `qr_crypto_object_str` 做AES加密 输出HEX(大写) 形成 `qr_pass`

8. 将以上获取的参数按下述格式转化为json字符串 `qr_key_object_str`

```
{
  "pass": qr_pass,
  "code": qr_key_auth_code
}
```

6. 使用上述的`qr_crypto_key`和`qr_crypto_vi` 对 `qr_key_object_str` 做AES加密 ，输出HEX(大写) 得到 二维码密钥串`qr_key`

7. 根据需要对`qr_key`进行压缩格式化，生成二维码图片即可

## 解析


> 实际上是对上述生成规则的一个简单逆处理

> 整个过程进行了1次服务端交互，1个数据提交，1个数据返回，1个数据参与解密

1. 首先客户端需要约定两个固定加密参数`qr_key_plain`和`qr_vi_plain`

2. 对以上两个参数MD5加密输出HEX(大写)形成`qr_crypto_key`和`qr_crypto_vi`

3. 对二维码密钥串进行解压缩得到`qr_key`并进行解密，得到 `qr_key_object_str`

4. 将 `qr_key_object_str` json格式化， 使用上述的`qr_crypto_key`和`qr_crypto_vi` 解密得到 `qr_key_object`得到如下格式数据

```
{
  "pass": qr_pass,
  "code": qr_key_auth_code
}
```

5. 使用上述取到的`qr_key_auth_code`请求服务端获取对应的 `qr_key_auth_vi`

6. 使用`qr_key_auth_code` 和 `qr_key_auth_vi` 做MD5加密输出HEX(大写)形成 `qr_crypto_object_key`和`qr_crypto_object_vi`

7. 使用`qr_crypto_object_key`和`qr_crypto_object_vi`对`qr_pass`做解密得到参数`qr_crypto_object_str`

8. 对`qr_crypto_object_str`做json格式化得到`qr_crypto_object`

```
{
  "key": qr_key,
  "vi": qr_vi
}
```
