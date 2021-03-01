const state = {
    // 把手动绘制电参数示功图中的table值存起来
    elecParamesList:[],
    // 把电参数示功图Y轴的值存起来
    elecTopParames:[],//上部分
    elecBottomParames:[],//下部分
    // 把载荷力Y轴的值存起来
    loadTopParames:[],//上部分
    loadBottomParames:[]//下部分
  }

  const mutations = {
    SET_ElecParame: (state, arr) => {
      state.elecParamesList = [...arr]
    },
    GET_ElecTopParames: (state, arr) => {
      state.elecTopParames = [...arr]
    },
    GET_ElecBottomParames: (state, arr) => {
      state.elecBottomParames = [...arr]
    },
    GET_LoadTopParames: (state, arr) => {
      state.loadTopParames = [...arr]
    },
    GET_LoadBottomParames: (state, arr) => {
      state.loadBottomParames = [...arr]
    },
  }  
  
  const actions = {}

  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }