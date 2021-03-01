// 项目 公共状态
import {
  getProjects
} from '@/api/project'
const state = {
  ProjectList: null,
  TaskList: null,
  isFilterOverdue: false
}

const mutations = {
  SET_PROJECTS: (state, arr) => {
    state.ProjectList = [...arr]
  },
  SET_TASKLIST: (state, arr) => {
    state.TaskList = [...arr]
  },
  setFilterOverdue: (state, bl) => {
    state.isFilterOverdue = bl
  }
}

const actions = {
  get_Projects({
    commit
  }, params) {
    getProjects().then(({
      data
    }) => {
      commit('SET_PROJECTS', data.msg)
    }).catch(() => {
      commit('SET_PROJECTS', null)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
