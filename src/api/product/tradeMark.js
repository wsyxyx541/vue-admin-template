//这个模块主要是获取品牌管理的数据的模块
import request from "@/utils/request";
//获取品牌列表接口
/* GET /admin/product/baseTrademark/{page}/{limit} */
export const reqTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });

//处理添加品牌的操作
/* /admin/product/baseTrademark/save POST 携带两个参数：品牌名称、品牌logo */
/* 切记，对于新增的品牌，给服务器传递数据，不需要传递id，id是由服务器生成的 */

//处理修改品牌的操作
/* /admin/product/baseTrademark/update PUT 携带三个参数：id、品牌名称、品牌logo */
/* 切记：对于修改某一个品牌的操作，前端携带的参数需要带上id，你需要告诉服务器修改的是哪一个品牌 */
export const reqAddorUpdateTradeMark = (trademark) => {
  //带给服务器的参数携带id那么就是修改
  if (trademark.id) {
    return request({
      url: "/admin/product/baseTrademark/update",
      method: "put",
      data: trademark,
    });
  } else {
    //反之没有携带就为添加
    return request({
      url: "/admin/product/baseTrademark/save",
      method: "post",
      data: trademark,
    });
  }
};

//删除品牌的操作
/* /admin/product/baseTrademark/remove/{id} delete */
export const reqDelteTradeMark = (id) =>
  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: "delete",
  });
