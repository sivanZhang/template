const state = {
  // 主页跳转我的任务带的参数
  keyword: '',
  taskId: -1
}

const mutations = {
  SET_KEYWORD: (state, str = '') => {
    state.keyword = str
  },
  setTaskId: (state, id = -1) => {
    state.taskId = Number(id)
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
