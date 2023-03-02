// 引入二次封装的axios
import request from "@/utils/request";

// 获取所有用户的信息
// http://127.0.0.1:3000/users/token/getalluser
export const getUserList = (data) =>
  request({
    url: "/users/token/getalluser",
    method: "post",
    data,
  });

// 冻结用户
// http://127.0.0.1:3000/users/token/freeze
export const freezeUser = (data) =>
  request({
    url: "/users/token/freeze",
    method: "post",
    data,
  });
// 解冻用户
// http://127.0.0.1:3000/users/token/nofreeze
export const noFreezeUser = (data) =>
  request({
    url: "/users/token/nofreeze",
    method: "post",
    data,
  });
// 审核用户信息通过
// http://127.0.0.1:3000/users/token/pass
export const pass = (data) =>
  request({
    url: "/users/token/pass",
    method: "post",
    data,
  });
// 审核用户信息不通过
// http://127.0.0.1:3000/users/token/nopass
export const noPass = (data) =>
  request({
    url: "/users/token/nopass",
    method: "post",
    data,
  });
// 获取待审核的用户信息
// http://127.0.0.1:3000/users/token/getischeckuser
export const getIscheckUser = (data) =>
  request({
    url: "/users/token/getischeckuser",
    method: "post",
    data,
  });
// 根据用户的名字获取用户信息
// http://127.0.0.1:3000/users/token/searchuserbyname
export const getUserByName = (data) =>
  request({
    url: "/users/token/searchuserbyname",
    method: "post",
    data,
  });
// 获取数据
// http://127.0.0.1:3000/users/token/getdata
export const getData = () =>
  request({
    url: "/users/token/getdata",
    method: "get",
  });
