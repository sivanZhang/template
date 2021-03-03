import dayjs from "dayjs";
// 字符形式的头像 格式化保留前一位
export function avatarFormat(text) {
  return `${text}`.substring(0, 1);
}
// 13位时间戳格式化为 YYYY/MM/DD HH:mm:ss
export function timeDateFormat(date) {
  if (date) {
    date = date;
    return dayjs(date).format("YYYY/MM/DD HH:mm:ss");
  } else {
    return "";
  }
}
// 时间戳格式化为 YYYY/MM/DD
export function dateFormat(date) {
  if (date) {
    date *= 1000;
    return dayjs(date).format("YYYY/MM/DD");
  } else {
    return "";
  }
}
// 时间戳格式化为 YYYY/MM/DD HH:mm:ss
export function dateTimeFormat(date) {
  if (date) {
    date *= 1000;
    return dayjs(date).format("YYYY/MM/DD HH:mm");
  } else {
    return "";
  }
}
// 时间格式化 HH:mm
export function dateHMSFormat(date) {
  if (date) {
    date *= 1000;
    return dayjs(date).format("HH:mm");
  } else {
    return "";
  }
}
