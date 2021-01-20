/**
 * 通用的一些方法
 */

const charsets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_"


export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const formatDate = (date = "") => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

export const getRandomStr = (len = 10) => {
  let randomStr = ""
  for (var i = 0; i < len; i++) {
    randomStr += charsets.charAt(Math.floor(Math.random() * charsets.length))
  }
  return randomStr
}

