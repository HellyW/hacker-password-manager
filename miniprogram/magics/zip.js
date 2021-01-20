

/*

原理大概是使用：

16进制按压缩比处理成36进制  以减少字符串长度

压缩比是参考了36进制和16进制的转化长度得出的

*/
// 适合长字段压缩，短字段效果不佳。甚至有反作用效果
// tips : 长度记录位  可做缩减处理   此处没有处理

// 压缩比
// 9 ： 7
const compressDecimal = 9
const decompressDecimal = 7

const fixedLength = (str, length = compressDecimal) => {
  return `${Array(length - str.length + 1).join('0')}${str}`
}

export class zip{
  compress(str){
    return new Promise((resolve, reject) => {
      try{
        // 输入的必须为16进制
        // 记录当前str位数  并转16进制备用
        const length = parseInt(str.length).toString(16)
        // 补位   前面补0   补全到compressDecimal的倍数
        const compressStr = fixedLength(str, compressDecimal * Math.ceil((str.length / compressDecimal)))
        // 按照压缩比compressDecimal  切割上述补全的字符串   进行进制转化
        let compressArr = compressStr.match(new RegExp(`(\\w{${compressDecimal}})`, 'g'))
        if(!compressArr || ! compressArr instanceof Array ) throw '压缩失败，传入的字符串不合法'
        // 转换后的字符串按照压缩比decompressDecimal补全长度  
        compressArr.unshift(length)
        compressArr = compressArr.map(v => {
          return fixedLength(parseInt(v, 16).toString(36), decompressDecimal)
        })
        // 将以上所有的进行拼接
        resolve(compressArr.join(''))
      }catch(error){
        reject(error)
      }
    })

  }
  decompress(str){
    return new Promise((resolve, reject) => {
      try{
        // 输入的必须为36进制
        // 补位   前面补0   补全到compressDecimal的倍数
        const decompressStr = fixedLength(str, decompressDecimal * Math.ceil((str.length / decompressDecimal)))  
        // 做分隔
        let decompressArr = decompressStr.match(new RegExp(`(\\w{${decompressDecimal}})`, 'g'))
        // 还原
        if(!decompressArr || ! decompressArr instanceof Array ) throw '解压失败，传入的字符串不合法'
        decompressArr = decompressArr.map(v => {
          return fixedLength(parseInt(v, 36).toString(16), compressDecimal)
        })
        const length = parseInt(decompressArr[0], 16).toString(10)
        decompressArr.shift()
        resolve(decompressArr.join('').substr(0 - length, length).toUpperCase())
      }catch(error){
        reject(error)
      }
    })

  }
}


// 方案一：

// 为何不选用下述的方案：
// 适合网络传输用，但似乎不适合做字符串压缩展示。长度有所增加

// const pako = require('pako');

// export class zip{
//   compress(text){
//     let compressChunks = []
//     const chunks =  pako.gzip(text)
//     console.log(chunks)
//     chunks.forEach(v => {
//       compressChunks.push(String.fromCharCode(v))
//     })
//     return compressChunks
//   }
//   decompress(str){
//     let chunks = []
//     for(let i = 0; i < str.length ; i++ ) chunks.push(str.charCodeAt(i))
//     // return chunks
//     return pako.inflate(chunks, { to: 'string' })
//   }
// }

// 方案二：

// 为何不选用下述的方案：
// 长度虽然变短了，但是所输出的不适合做二维码显示。二维码生成和解析的复杂度没有降低，可能还变麻烦了

// export class zip {
//   compress(strNormalString) {
//     console.log(" 压缩前长度： " + strNormalString.length);
//     var strCompressedString = "";

//     var ht = new Array();
//     for (i = 0; i < 128; i++) {
//       ht[i] = i;
//     }

//     var used = 128;
//     var intLeftOver = 0;
//     var intOutputCode = 0;
//     var pcode = 0;
//     var ccode = 0;
//     var k = 0;

//     for (var i = 0; i < strNormalString.length; i++) {
//       ccode = strNormalString.charCodeAt(i);
//       k = (pcode << 8) | ccode;
//       if (ht[k] != null) {
//         pcode = ht[k];
//       } else {
//         intLeftOver += 12;
//         intOutputCode <<= 12;
//         intOutputCode |= pcode;
//         pcode = ccode;
//         if (intLeftOver >= 16) {
//           strCompressedString += String.fromCharCode(intOutputCode >> (intLeftOver - 16));
//           intOutputCode &= (Math.pow(2, (intLeftOver - 16)) - 1);
//           intLeftOver -= 16;
//         }
//         if (used < 4096) {
//           used++;
//           ht[k] = used - 1;
//         }
//       }
//     }

//     if (pcode != 0) {
//       intLeftOver += 12;
//       intOutputCode <<= 12;
//       intOutputCode |= pcode;
//     }

//     if (intLeftOver >= 16) {
//       strCompressedString += String.fromCharCode(intOutputCode >> (intLeftOver - 16));
//       intOutputCode &= (Math.pow(2, (intLeftOver - 16)) - 1);
//       intLeftOver -= 16;
//     }

//     if (intLeftOver > 0) {
//       intOutputCode <<= (16 - intLeftOver);
//       strCompressedString += String.fromCharCode(intOutputCode);
//     }

//     console.log(" 压缩后长度： " + strCompressedString.length);
//     return strCompressedString;
//   }
//   decompress(strCompressedString) {
//     var strNormalString = "";
//     var ht = new Array();

//     for (i = 0; i < 128; i++) {
//       ht[i] = String.fromCharCode(i);
//     }

//     var used = 128;
//     var intLeftOver = 0;
//     var intOutputCode = 0;
//     var ccode = 0;
//     var pcode = 0;
//     var key = 0;

//     for (var i = 0; i < strCompressedString.length; i++) {
//       intLeftOver += 16;
//       intOutputCode <<= 16;
//       intOutputCode |= strCompressedString.charCodeAt(i);

//       while (1) {
//         if (intLeftOver >= 12) {
//           ccode = intOutputCode >> (intLeftOver - 12);
//           if (typeof (key = ht[ccode]) != " undefined ") {
//             strNormalString += key;
//             if (used > 128) {
//               ht[ht.length] = ht[pcode] + key.substr(0, 1);
//             }
//             pcode = ccode;
//           } else {
//             key = ht[pcode] + ht[pcode].substr(0, 1);
//             strNormalString += key;
//             ht[ht.length] = ht[pcode] + key.substr(0, 1);
//             pcode = ht.length - 1;
//           }

//           used++;
//           intLeftOver -= 12;
//           intOutputCode &= (Math.pow(2, intLeftOver) - 1);
//         } else {
//           break;
//         }
//       }
//     }
//     return strNormalString;
//   }
// }