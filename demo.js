var express = require('express')
var router = express.Router()
const { auvURL } = require('./../config')
const filter = require('./../utils/filter')
const axios = require('axios')

const XLSX = require('xlsx')
var stream = require('stream')
const urlencode = require('urlencode')

/* 导出excel */
router.get('/ex', async function(req, res, next) {
  // 请求数据
  const params = {
    timeData: req.query.timeData || filter.year_month_day_num(new Date())
  }
  req.query.phoneId && (params.phoneId = req.query.phoneId)
  const resObj = await axios.get(`${auvURL}/auv/sy/login.do`, {
    params: params
  })
  // 处理返回数据
  const arr = []
  if (resObj.data.a && resObj.data.a.length > 0) {
    resObj.data.a.map((item, index) => {
      arr.push({
        // 姓名
        time: filter.year_month_day_hour_min(item.c),
        //  手机号
        info: item.d.split('|')
      })
    })
  }
  const resArray = arr.map(function(i) {
    return [i.time, i.info[1], i.info[2], i.info[3], i.info[4], i.info[5]]
  })
  const sheetTitle = ['登录时间', '手机号', '姓名', '设备号', '设备名', '设备版本']
  resArray.unshift(sheetTitle)

  // 存储下载
  const book = XLSX.utils.book_new()
  const sheet = XLSX.utils.aoa_to_sheet(resArray)
  XLSX.utils.book_append_sheet(book, sheet, '导出数据')

  const fileContents = XLSX.write(book, { type: 'buffer', bookType: 'xlsx', bookSST: false })

  var readStream = new stream.PassThrough()
  readStream.end(fileContents)

  let fileName = '导出数据.xlsx'
  res.set('Content-disposition', 'attachment; filename=' + urlencode(fileName))
  res.set('Content-Type', 'text/plain')

  readStream.pipe(res)
})

module.exports = router
