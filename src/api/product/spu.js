import request from "@/utils/request";

//  获取SPU列表数据的接口
//  GET /admin/product/{page}/{limit}  page limit category3Id
export const reqSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: "get",
    params: { category3Id },
  });

//获取SPU信息
//  GET /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) =>
  request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: "get",
  });

//获取品牌的信息
//GET /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = () =>
  request({
    url: "/admin/product/baseTrademark/getTrademarkList",
    method: "get",
  });

//获取spu图片的接口
// GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });

//获取平台的全部的销售属性  -- 一共三个
// /admin/product/baseSaleAttrList get
export const reqBaseAttrList = () =>
  request({
    url: "/admin/product/baseSaleAttrList",
    method: "get",
  });

//修改spu||添加spu：对于修改或添加，携带给服务器的参数大多是一样的，唯一的区别就是携带者的参数是否带id
export const reqAddorUpdate = (spuInfo) => {
  //如果携带的参数有id---修改spu
  if (spuInfo.id) {
    return request({
      url: "/admin/product/updateSpuInfo",
      method: "post",
      data: spuInfo,
    });
  }
  //携带的参数没有id---添加spu
  else {
    return request({
      url: "/admin/product/saveSpuInfo",
      method: "post",
      data: spuInfo,
    });
  }
};

//删除spu
// /admin/product/deleteSpu/{spuId} delete
export const reqDeletespu = (spuId) =>
  request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: "delete",
  });

//获取图片的数据
// /admin/product/spuImageList/{spuId} get
export const reqSpuImageList1 = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });

//获取销售属性的数据
// /admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList = (spuId) =>
  request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: "get",
  });

//获取平台属性的数组
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrinfoList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });

//添加sku
// /admin/product/saveSkuInfo post
export const reqAddSku = (skuInfo) =>
  request({
    url: "/admin/product/saveSkuInfo",
    method: "post",
    data: skuInfo,
  });

//获取sku列表数据的接口
// /admin/product/findBySpuId/{spuId}  get
export const reqSkuList = (spuId) =>
  request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: "get",
  });
