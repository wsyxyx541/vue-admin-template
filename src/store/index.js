import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import app from "./modules/app";
import settings from "./modules/settings";
import user from "./modules/user";
import home from "./modules/home";
Vue.use(Vuex);

const store = new Vuex.Store({
  namespaced: true,
  modules: {
    home,
    app,
    settings,
    user,
  },
  getters,
});

export default store;
