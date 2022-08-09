import request from "@/utils/request";

//sku列表接口
// GET /admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) =>
  request({
    url: `/admin/product/list/${page}/${limit}`,
    method: "get",
  });

//上架
// /admin/product/onSale/{skuId} get
export const reqOnSale = (skuId) =>
  request({
    url: `/admin/product/onSale/${skuId}`,
    method: "get",
  });

//下架
// /admin/product/cancelSale/{skuId} get
export const reqCancelSale = (skuId) =>
  request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: "get",
  });

//获取sku详情的接口
//GET /admin/product/getSkuById/{skuId}
export const reqSkuById = (skuId) =>
  request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: "get",
  });
