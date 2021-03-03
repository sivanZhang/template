import Vue from "vue";
import "normalize.css/normalize.css";
import ElementUI from "element-ui";
import "@/styles/element-variables.scss";
import App from "./App";
import store from "./store";
import router from "./router";
import "@/icons";
import "./permission";
import * as filters from "@/filters"; // global filters
import "@/styles/index.scss"; // global css

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.use(ElementUI);
Vue.config.productionTip = false;
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
