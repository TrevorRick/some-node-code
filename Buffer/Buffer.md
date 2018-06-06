
1字节（bytes）= 8位（bits）
1个汉字（utf-8） = 3字节（bytes）
1kb = 1027字节
### Buffer结构
###### Buffer是一个像Array的对象，但主要用于操作字节。
#### Buffer对象

---
###### Buffer对象类似与Array，元素为16进制的两位数，即0到255的数值。不同编码的字符串占用的元素个数不同（中文字在UTF-8编码下占3位，字母和半角标点符号占1位）.
```
let str = '深入浅出node.js';
let buf = new Buffer(str, 'utf-8');
console.log(buf);
// => <Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 6e 6f 64 65 2e 6a 73>
```
###### Buffer类似Array，可以访问length属性得到长度，也可以通过下标访问元素（得到的是一个0～255的数值）或者赋值，构造对象时也相似：

```
let buf = new Buffer(100);  //分配长100字节的buffer
console.log(buf[10]); // =>115
buf[10] = 10;
console.log(buf[10]); // =>10
```
###### *如果给元素赋值的是大于255的数值，逐次减256，直到得到0～255之间的数值；小于0的数值，逐次加256，直到得到0～255之间的数值；如果是小数，只保留整数部分。*
#### Buffer内存分配

---
###### buffer对象的内存分配采用在node的c++层面实现内存申请，在Javascript中分配内存的策略。
###### Node采用了slab的动态内存管理机制，slab是一块申请好的固定大小的内存区域。具有以下3中状态：
- full:完全分配状态
- partial：部分分配状态
- empty: 没有被分配状态
###### Node以8kb为界限来区分Buffer是大对象还是小对象:Buffer.poolsize = 8 * 1024
###### 8kb是每个slab的大小值，在Javascript层面以它作为单位单元进行内存分配

```
new Buffer(size);   // 分配指定大小的Buffer对象
```
### Buffer的转换
###### Buffer对象可以与字符串之间相互转换，支持的字符串编码有：
- ASCII
- UTF-8
- UTF-16LE/UCS-2
- Base64
- Binary
- Hex
#### 字符串转Buffer

---
```
let buf = new Buffer(str, [encoding]);
```
###### encoding不传时,默认UTF-8.调用write()方法可以不断写入内容到Buffer对象中

```
buf.write(string, [offset], [lenght], [encoding]);
// 每次写入可以指定编码，所以Buffer对象中可以存在多种编码转化后的内容（不同编码所用字节长度不同），将Buffer反转回字符串时需要注意
```
#### Buffer转字符串
###### 
```
buf.toString([encoding], [start], [end]);
// encoding(默认UTF-8)：如果Buffer对象由多种编码写入，需要指定该参数转换回正常的编码;[start],[end]指定转换的起始位置
```
#### Buffer不支持的编码类型

```
Buffer.isEncoding(enconding);   
// 返回true，表示Buffer对象支持encoding的编码。
//  GBK不支持
```
###### 对不支持的编码类型，iconv-lite(纯JavaScript，更轻量)和iconv(通过C++调用libiconv库完成)模块可以实现

```
//  iconv-lite实现
const iconv = require('iconv-lite');
```
### Buffer的拼接
###### Buffer在使用时是一段一段方式传输，在有宽字节时要注意乱码问题。

```
const fs = require('fs');
const path = require('path');
const rs = fs.createReadStream(path.resolve(__dirname + '/test.md'), {highWaterMark: 11});
rs.setEncoding('utf8');

let data = '';
rs.on('data', function (chunk) {
    data += chunk;  // 未setEncoding时 chunk是一个Buffer对象，由于我们设置了每次读取Buffer的长度为11，所以会出现乱码设置之后可读流在内部设置一个decoder对象，每次data事件
                    // 都通过这个decoder对象进行Buffer到字符串的解码，此时chunk是一个解码后的字符串
    console.log(chunk);
});
rs.on('end', function () {
    console.log(data);
})
```
###### setEncoding()目前只能处理UTF-8,Base64和 UCS-2/UTF-16LE这三种编码的Buffer拼接
#### 正确拼接Buffer

---
将多个小Buffer对象拼接为一个Buffer对象，再通过iconv-lite这类的模块转码。

```
// 用一个数组来存储接收到的所有Buffer片段并记录下所有片段的总长度，然后调用Buffer.concat()方法生成一个合并的Buffer对象。
let chunks = [];
let size = 0;
res.on('data', function(chunk){
    chunks.push(chunk);
    size += chunk.length();
});
res.on('end', function(){
    let buf = Buffer.concat(chunks, size);
    let str = iconv.decode(buf, 'utf8');
    console.log(str);
});

// Buffer.concat()方法实现了从小Buffer对象到大Buffer对象的复制过程。
Buffer.concat(list, length) {
    if (!Array.isArray(list){
        throw new Error('Usage: Buffer.concat(list, [length])');
    })
    if (list.length === 0 ) {
        return new Buffer(0);
    } else if (list.length === 1) {
        return list[0];
    }
    
    if (typeof length != 'number') {
        length = 0;
        for (let i = 0; i < list.length; i++) {
            let buf = list[i];
            length += buf.length;
        }
    }
    
    let buffer = new Buffer(length);
    let pos = 0;
    for (let i = 0; i < list.length; i++) {
        let buf = list[i];
        buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};
```









