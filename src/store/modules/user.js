import { login, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
};

const actions = {
  // 用户登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    let result = await login({
      name: username.trim(),
      password: password,
    });
    if (result.code == 200) {
      commit("SET_AVATAR", result.data.url);
      commit("SET_NAME", result.data.name);
      commit("SET_TOKEN", result.token);
      setToken(result.token);
      return "ok";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  // get user info
  async getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((response) => {
          const data = response.data;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const { name, url } = data;

          commit("SET_NAME", name);
          commit("SET_AVATAR", url);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // user logout
  async logout({ commit, state }) {
    removeToken(); // must remove  token  first
    resetRouter();
    commit("RESET_STATE");
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
