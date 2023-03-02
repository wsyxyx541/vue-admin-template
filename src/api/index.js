// 将模块请求的接口统一暴露
import * as category from "./essay/category";
import * as comment from "./essay/comment";
import * as content from "./essay/content";
import * as userlist from "./users/userlist";
// 对外暴露
export default {
  category,
  comment,
  content,
  userlist,
};
