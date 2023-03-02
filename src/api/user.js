import request from "@/utils/request";

// 用户登录
// http://127.0.0.1:3000/admin/login
export function login(data) {
  return request({
    url: "/admin/login",
    method: "post",
    data,
  });
}
// 获取用户信息
// http://127.0.0.1:3000/admin/token/getinfo
export function getInfo() {
  return request({
    url: "/admin/token/getinfo",
    method: "get",
  });
}
