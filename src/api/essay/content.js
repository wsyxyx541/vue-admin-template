// 引入二次封装的axios
import request from "@/utils/request";

// 获取新添加的文章，进行审核
// http://127.0.0.1:3000/essays/token/getnewessays
export const getNewEssays = (data) =>
  request({
    url: "/essays/token/getnewessays",
    method: "post",
    data,
  });

// 根据文章id获取文章内容
// http://127.0.0.1:3000/essays/token/getessayc
export const getContent = (data) =>
  request({
    url: "/essays/token/getessayc",
    method: "post",
    data,
  });
// 审核通过
// http://127.0.0.1:3000/essays/token/checkright
export const checkRight = (data) =>
  request({
    url: "/essays/token/checkright",
    method: "post",
    data,
  });
// 审核没通过
// http://127.0.0.1:3000/essays/token/checknoright
export const checkNoRight = (data) =>
  request({
    url: "/essays/token/checknoright",
    method: "post",
    data,
  });
// 查询文章
// http://127.0.0.1:3000/essays/token/searchessaysht
export const checkEssaysHT = (data) =>
  request({
    url: "/essays/token/searchessaysht",
    method: "post",
    data,
  });
