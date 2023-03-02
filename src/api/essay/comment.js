// 引入二次封装的axios
import request from "@/utils/request";

// 获取未被审查的留言信息
// http://127.0.0.1:3000/comment/token/showlist
export const getCommentList = (data) =>
  request({
    url: "/comment/token/showlist",
    method: "post",
    data,
  });

// 审查通过
// http://127.0.0.1:3000/comment/token/checkright
export const isCheckPass = (data) =>
  request({
    url: "/comment/token/checkright",
    method: "post",
    data,
  });
// 审查失败
// http://127.0.0.1:3000/comment/token/checknoright
export const isCheckNoPass = (data) =>
  request({
    url: "/comment/token/checknoright",
    method: "post",
    data,
  });
// 搜索留言
// http://127.0.0.1:3000/comment/token/checkillegality
export const checkIllegality = (data) =>
  request({
    url: "/comment/token/checkillegality",
    method: "post",
    data,
  });
