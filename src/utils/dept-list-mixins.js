import { mapState } from "vuex";
export default {
    data() {
        return {
            // 原始部门id列表
            selectList: []
        }
    },
    computed: {
        //DeptUsers是根据登录账号得来的
        ...mapState("admin", ["DeptList"])
      },
    methods: {
        $_formatList() {
            function changeList(arr) {
              for (const item of arr) {
                if (item["children"] && item["children"].length) {
                  changeList(item["children"]);
                } else {
                  item["children"] = null;
                }
              }
            }
            this.selectList = JSON.parse(
              JSON.stringify(this.DeptList)
                .replace(/name/g, "label")
                .replace(/id/g, "value")
            );
            changeList(this.selectList);
          }
    },
    async created() {
        if (!this.DeptList) {
          await this.$store.dispatch("admin/get_DeptList");
          this.$_formatList();
        } else {
          this.$_formatList();
        }
      }
}