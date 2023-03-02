// 引入二次封装的axios
import request from "@/utils/request";

// 获取文章分类的接口
//http://127.0.0.1:3000/category/getlist
export const reqCategoryList = () =>
  request({
    url: "/category/getlist",
    method: "get",
  });

// 添加文章分类的接口
//http://172.16.5.128:3000/category/token/add
export const reqCategoryAdd = (data) =>
  request({
    url: "/category/token/add",
    method: "post",
    data,
  });
// 删除文章分类的接口
// http://172.16.5.128:3000/category/token/delete
export const reqCategoryDelete = (data) =>
  request({
    url: "/category/token/delete",
    method: "post",
    data,
  });
// 修改文章分类的接口
// http://172.16.5.128:3000/category/token/update
export const reqCategoryUpdate = (data) =>
  request({
    url: "/category/token/update",
    method: "post",
    data,
  });
