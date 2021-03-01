import dayjs from 'dayjs';
// 字符形式的头像 格式化保留前一位
export function avatarFormat(text) {
  return `${text}`.substring(0, 1)
}
 // 13位时间戳格式化为 YYYY/MM/DD HH:mm:ss
export  function timeDateFormat(date) {
  if (date) {
    date = date
    return dayjs(date).format('YYYY/MM/DD HH:mm:ss')
  } else {
    return ''
  }
}
// 时间戳格式化为 YYYY/MM/DD
export function dateFormat(date) {
  if (date) {
    date *= 1000
    return dayjs(date).format('YYYY/MM/DD')
  } else {
    return ''
  }
}
// 时间戳格式化为 YYYY/MM/DD HH:mm:ss
export function dateTimeFormat(date) {
  if (date) {
    date *= 1000
    return dayjs(date).format('YYYY/MM/DD HH:mm')
  } else {
    return ''
  }
}
// 时间格式化 HH:mm
export function dateHMSFormat(date) {
  if (date) {
    date *= 1000
    return dayjs(date).format('HH:mm')
  } else {
    return ''
  }
}
// 油井运行状态格式化显示
export function wellStatus(code) {
  switch (code) {
    case 0:
          return "开井";
          break;
        case 1:
          return "关井";
          break;
        case 2:
          return "设备已被移除";
          break;
  }
}
// 油井的机型转向
export function wellTurn(code) {
  switch (code) {
    case 0:
      return "顺时针";
      break;
    case 1:
      return "逆时针";
      break;
  }
}
//点位数格式化
export function dataType(code) {
  switch (code) {
    case 0:
      return "145";
      break;
    case 1:
      return "200";
      break;
  }
}
// DTU连接状态格式化显示
export function dtuStatus(code) {
    switch (code) {
      case 0:
        return "连接";
        break;
      case 1:
        return "未连接";
        break;
    }
}
// 油井类别格式化显示
export function welltype(code) {
  switch (code) {
    case 0:
      return "抽油井";
      break;
    case 1:
      return "螺杆泵";
      break;
  }
}
// 告警方式格式化显示
export function alarmWay(code) {
  switch (code) {
    case 0:
      return "系统自动";
      break;
    case 1:
      return "人为手动";
      break;
  }
}
// 告警类型格式化显示
export function alarmCategory(code) {
  switch (code) {
    case 0:
      return "开关井异常";
      break;
    case 1:
      return "动液面异常";
      break;
    case 2:
      return "日产量告警";
      break;
  }
}
// 告警状态格式化显示
export function alarmStatus(code) {
  switch (code) {
    case 0:
      return "新增";
      break;
    case 1:
      return "忽略";
      break;
    case 2:
      return "关闭";
      break;
    case 3:
      return "误报";
      break;
    case 4:
      return "已处置";
      break;
  }
}
// 示功图手动还是自动存入数据库
export function dataSrc(code) {
  switch (code) {
    case 0:
      return "手动";
      break;
    case 1:
      return "自动";
      break;
  }
}
// 项目工作流格式化
export function projectStatus(code) {
  switch (code) {
    case 0:
      return '未开始'
    case 1:
      return '正在进行'
    case 2:
      return '已完成'
    case 3:
      return '超期'
    case 4:
      return '暂停'
  }
}
// 数字保留两位小数并且格式化
export function numberFormat(num) {
  return (+num).toLocaleString(undefined, {
    maximumFractionDigits: 2
  })
}

// 通知是否已读
export function isRead(data) {
  switch (data) {
    case 0:
      return '未读'
      break
    case 1:
      return '已读'
      break
  }
}

// 审批流程等级
export function WKLevel(data) {
  switch (data) {
    case 0:
      return '收文'
      break
    case 1:
      return '一级审批'
      break
    case 2:
      return '二级审批'
      break
    case 3:
      return '三级审批'
      break
  }
}

// 自定义属性类别
export function attrsFilter(attrs) {
  switch (attrs) {
    case 1:
      return 'NUMBER'
      break
    case 2:
      return 'CHARACTER'
      break
    case 3:
      return 'DATE '
      break
    case 4:
      return 'BOOLEAN'
      break
    case 5:
      return 'ENUMERATE'
      break
  }
}
// 诊断来源类别
export function djagFilter(attrs) {
  switch (attrs) {
    case 0:
      return '自动'
      break
    case 1:
      return '手动'
      break
    case 2:
      return 'DTU上报'
      break
  }
}

