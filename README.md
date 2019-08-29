# nodejs-express-下载 Excel 表格

## 引入模块

```javascript
const XLSX = require('xlsx')
const stream = require('stream')
const urlencode = require('urlencode')
```

## 数据格式

数据格式:`[[表头],[数据1],[数据2]...]`

**_eg:_**

```javascript
const resData = [
    ['登录时间', '手机号', '姓名', '设备号', '设备名', '设备版本'],
    ["2019/8/29 4:50","17666088943","zkw","863897042302310","OPPO_PBAM00","Android_8.1.0"],
    ...
]
```

## 核心代码

```javascript
const book = XLSX.utils.book_new()
const sheet = XLSX.utils.aoa_to_sheet(resArray)
XLSX.utils.book_append_sheet(book, sheet, '表格名称')

const fileContents = XLSX.write(book, { type: 'buffer', bookType: 'xlsx', bookSST: false })

var readStream = new stream.PassThrough()
readStream.end(fileContents)

let fileName = '表格名称.xlsx'
res.set('Content-disposition', 'attachment; filename=' + urlencode(fileName))
res.set('Content-Type', 'text/plain')

readStream.pipe(res)
```

> **urlencode**模块,可以将下载的Excel文件名设为中文。

## 参考

https://juejin.im/post/5c920b36f265da6112563703
