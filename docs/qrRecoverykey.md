## 备份密钥

针对密钥二维码由于本地生成不上传服务端而导致丢失无法找回的问题设计的。

将密钥二维码串作为加密对象，进行加密压缩而得出的字符串信息。


### 特点

* 本地生成
* 不上传服务端
* 丢失无法找回
* 密钥二维码的“复印件”
* 泄露可能导致密钥二维码暴露

### 生成

参考小程序内代码文件`/miniprogram/magics/qrRecoveryKeyManage.js`

> 整个过程进行了1次服务端交互，0个数据提交，2个数据返回，2个数据参与加密

1. 首先客户端需要约定两个固定加密参数`qr_recovery_key_plain`和`qr_recovery_vi_plain`

2. 对以上两个参数MD5加密输出HEX(大写)形成`qr_recovery_crypto_key_a`和`qr_recovery_crypto_vi`

3. 准备参数二维码密钥串`qr_key`

4. 请求服务端生成恢复密钥串合法识别码`qr_recovery_key_auth_code`和恢复密钥串标记`qr_recovery_key_auth_pass`

5. 对以上参数`qr_recovery_key_auth_code`MD5加密输出HEX(大写)形成`qr_crypto_recovery_key_b`

6. 使用`qr_crypto_recovery_key_b`和`qr_recovery_crypto_vi`将二维码密钥串`qr_key`进行AES加密输出HEX(大写)得到`qr_decrypt_key`

7. 将参数按照下述形式转化成json格式并处理成字符串， 得到`qr_recovery_key_object_str`

```
{
  "decryptKey": qr_decrypt_key,
  "recoveryPass": qr_recovery_key_auth_pass
}
```

8. 使用`qr_recovery_crypto_key_a`和`qr_recovery_crypto_vi`将`qr_recovery_key_object_str`进行AES加密输出HEX(大写)得到二维码密钥恢复串`qr_recovery_key`

9. 将二维码密钥恢复串`qr_recovery_key`压缩格式化后复制到剪贴板内即可


### 解析


> 实际上是对上述生成规则的一个简单逆处理

> 整个过程进行了1次服务端交互，1个数据提交，1个数据返回，2个数据参与解密

1. 首先客户端需要约定两个固定加密参数`qr_recovery_key_plain`和`qr_recovery_vi_plain`

2. 对以上两个参数MD5加密输出HEX(大写)形成`qr_recovery_crypto_key_a`和`qr_recovery_crypto_vi`

3. 对二维码密钥恢复串`qr_recovery_key`解压缩处理后。使用`qr_recovery_crypto_key_a`和`qr_recovery_crypto_vi`对其进行AES解密输出并格式化成JSON，即`qr_recovery_key_object`得到如下数据

```
{
  "decryptKey": qr_decrypt_key,
  "recoveryPass": qr_recovery_key_auth_pass
}
```

4. 将获取到`recoveryPass`通过接口请求获取`qr_recovery_key_auth_code`

5. 将获取的`qr_recovery_key_auth_code`MD5加密输出HEX(大写)形成`qr_crypto_recovery_key_b`

6. 使用`qr_crypto_recovery_key_b`和`qr_recovery_crypto_vi`将解析出的`qr_recovery_key_object`内的`decryptKey`进行AES解密得到`qr_key`

7. 重新使用`qr_key`绘制二维码即可

