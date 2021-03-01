import Vue from "vue";
import Cookies from "js-cookie";
import "normalize.css/normalize.css"; // Normalize.css使浏览器更加一致地呈现所有元素，并符合现代标准。它只针对需要规范化的样式。
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
Vue.use(ElementUI, {
  size: Cookies.get("size") || "mini"
});
Vue.config.productionTip = false;
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
