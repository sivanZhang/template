<template>
  <div id="profession">
    <ElRow :gutter="24">
      <ElCol :span="6">
        <el-card>
          <h4 slot="header">部门</h4>
          <div>
            <el-row type="flex" align="middle" class="nav-title" v-if="DeptAuth">
              <el-button @click="openGroupForm('add')" type="success" style="width:100%">添加部门</el-button>
            </el-row>
            <el-input class="search-group" placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
            <el-tree
              class="filter-tree"
              empty-text="未创建部门"
              highlight-current
              ref="tree"
              :data="DeptList"
              @node-click="handleGroupClick"
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="searchGroup"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span style="margin-right:6px;">{{node.label}}</span>
                <span class="iconWarp">
                  <i
                    class="el-icon-plus"
                    @click="openGroupForm('add',data)"
                    style="color:#409EFF"
                    title="添加子部门"
                    v-if="DeptAuth"
                  ></i>
                  <i
                    class="el-icon-delete"
                    @click="removeGroup(data)"
                    style="color:#F56C6C"
                    title="删除当前部门"
                    v-if="DeptAuth"
                  ></i>
                </span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </ElCol>
      <ElCol :span="18">
        <el-card>
          <h4 slot="header">相关操作</h4>
          <div>
            <div class="t-header">
              <el-row type="flex" align="middle">
                <el-col :span="12">
                  <el-button
                    @click="openGroupForm('update')"
                    type="primary"
                    v-if="DeptAuth"
                    :disabled="showList"
                  >修改部门信息</el-button>
                  <el-button
                    @click="openChangeMember(1)"
                    type="primary"
                    v-if="DeptAuth"
                    :disabled="showList"
                  >添加成员</el-button>
                  <el-button
                    @click="openChangeMember(0)"
                    type="danger"
                    v-if="DeptAuth"
                    :disabled="showList"
                  >删除成员</el-button>
                
                </el-col>
                <el-col :span="6">
                  <label for>部门名称</label>

                  ： {{ActiveGroup?ActiveGroup.name:'--'}}
                  <font
                    style="font-size:8px;"
                  >({{ActiveGroup?ActiveGroup.alias:'--'}})</font>
                </el-col>

                <el-col :span="6">
                  <label for>部门负责人</label>
                  ：{{ActiveGroup?ActiveGroup.charger_name : '未指定'}}
                </el-col>
              </el-row>
            </div>
            <users-table :UserList="GroupUsers" :table-loading="tableLoading" @jump="jumpChange"></users-table>
          </div>
        </el-card>
      </ElCol>
    </ElRow>
    <div style="margin-top:50px"></div>
    <!-- 右击侧栏展示审批流程 -->
    <template v-if="isDrawerShow">
      <Drawer
        scrollable
        :title="activeTemplate.name+'的审批流程'"
        v-model="isDrawerShow"
        width="512px"
        inner
        :mask-style="{backgroundColor: 'transparent'}"
        :transfer="false"
      >
        <links
          :LinkTemplateList="LinkTemplateList"
          :deptId="activeTemplate.id"
          :deptName="activeTemplate.name"
          @refresh="show(ActiveGroup)"
          :DeptAuth="DeptAuth"
        ></links>
      </Drawer>
    </template>
    <!-- 添加用户组弹出框 -->
    <el-dialog :title="DialogType.title" :visible.sync="dialogFormVisible" width="460px">
      <el-form :model="GroupForm" ref="GroupForm" :rules="GroupRules">
        <el-form-item label="部门名" label-width="20%" prop="name">
          <el-input v-model.trim="GroupForm.name" autocomplete="off" style="width:100%"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门别名" label-width="20%" prop="alias">
          <el-input v-model.trim="GroupForm.alias" autocomplete="off" style="width:100%"></el-input>
        </el-form-item> -->
        <el-form-item label="负责人" label-width="20%" prop="chargerid">
          <el-select v-model="GroupForm.chargerid" placeholder="负责人" style="width:100%" filterable>
            <el-option
              v-for="(item,index) of UserList"
              :label="item.username"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>

        <el-button
          :loading="Loadings.addDeptLoading"
          type="primary"
          @click="DialogType.type==='add'?appendGroup():updateGroup()"
        >提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="MemberEditState['title']" :visible.sync="isMemberEditShow" width="460px">
      <el-select v-model="SelectMembers" multiple placeholder="请选择" style="width:100%" filterable>
        <el-option
          v-for="(item,index) of AllMembers"
          :label="item.username"
          :value="item.id"
          :key="index"
        ></el-option>
      </el-select>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isMemberEditShow = false">取 消</el-button>

        <el-button
          :loading="Loadings.memberEditLoading"
          :type="MemberEditState.type?'primary':'danger'"
          @click="changeMember"
        >{{MemberEditState.type?'添 加':'删 除'}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDept,
  addDept,
  putDept,
  removeDept,
  getWKTemplate,
  getRoles,
    getUserList,
} from "@/api/admin";
import usersTable from "@/views/components/UsersTable";
import links from "./components/links";
import { mapState } from "vuex";

export default {
  name: "profession",
  data() {
    return {
      tableLoading: false,
      isDrawerShow: false,
      activeTemplate: null,
      LinkTemplateList: [],
      SelectMembers: [],
      AllMembers: [],
      UserList:[],
      MemberEditState: {},
      isMemberEditShow: false,
      GroupUsers: [],
      filterText: "",
      ActiveGroup: null,
      DialogType: {},
      defaultProps: {
        children: "children",

        label: "name"
      },
      GroupForm: {},
      dialogFormVisible: false,
      GroupRules: {
        name: [
          {
            required: true,

            trigger: "blur",

            message: "部门名称未填写"
          }
        ],
        // alias: [
        //   // { required: true, message: "请输入别名", trigger: "blur" },
        //   {
        //     pattern: /^[a-zA-Z][A-Za-z\s]*[a-zA-Z]*$/,
        //     message: "请输入英文",
        //     trigger: "change"
        //   }
        // ],
        chargerid: [
          {
            
            required: true,
            trigger: "blur",

            message: "部门负责人未选择"
          }
        ]
      },
      Loadings: {
        addDeptLoading: false,

        memberEditLoading: false
      },
      showList: true
    };
  },
  computed: {
    classObject: function() {
      return {
        active: this.isActive && !this.error
      };
    },
    ...mapState("admin", [ "DeptList", "DeptAuth"])
  },
  methods: {
    jumpChange(val) {
      //  console.log(val);
      getDept({
        id: val
      })
        .then(({ data }) => {
          const msg = data.msg;
          this.handleGroupClick(msg);
        })
        .catch(err => {});
    },
    //http获取“用户组”列表
    getDeptList() {
      this.$store.dispatch("admin/get_DeptList");
    },
    async changeMember() {
      if (!this.SelectMembers.length) {
        this.$message.warning("未选择用户");

        return;
      }

      let data = {
        id: this.ActiveGroup.id,

        method: "put"
      };

      if (this.MemberEditState.type) {
        data = {
          ...data,

          add_user_ids: this.SelectMembers.join()
        };
      } else {
        data = {
          ...data,

          del_user_ids: this.SelectMembers.join()
        };
      }

      this.Loadings.memberEditLoading = true;

      await putDept(data)
        .then(({ data }) => {
          this.Loadings.memberEditLoading = false;

          if (data.status === 0) {
            this.$message.success(data.msg);

            //成功后刷新该组成员

            this.handleGroupClick(this.ActiveGroup);
          } else {
            this.$message.error(data.msg);
          }
        })

        .catch(() => {
          this.Loadings.memberEditLoading = false;
        });

      this.isMemberEditShow = false;
    },
    openChangeMember(type = 0) {
      this.SelectMembers = [];

      if (type) {
        this.MemberEditState = Object.assign(
          {},
          {
            type,

            title: "添加成员"
          }
        );

        this.AllMembers = Object.assign({}, this.UserList);
      } else {
        this.MemberEditState = Object.assign(
          {},
          {
            type,

            title: "删除成员"
          }
        );

        this.AllMembers = Object.assign({}, this.GroupUsers);
      }

      this.isMemberEditShow = true;
    },
    /**

       *

       *点击用户组事件

       * @param data 当前点击激活的组

       *

       */
    // 单击流程审批按钮触发事件
    show(ActiveGroup) {
      this.activeTemplate = ActiveGroup;
      console.log(this.activeTemplate.id);
      this.isDrawerShow = true;
      getWKTemplate({
        dept: this.activeTemplate.id
      }).then(({ data }) => {
        this.LinkTemplateList = [...data.msg];
        // console.log("LinkTemplateList");
        // console.log(this.LinkTemplateList);
      });
    },

    // 工种单击触发事件
    handleGroupClick(data) {
      this.showList = false;
      this.ActiveGroup = { ...data };
      this.tableLoading = true;
      getDept({
        id: data.id
      })
        .then(({ data }) => {
          this.GroupUsers = [...data.users];
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },

    appendGroup() {
      //验证表单

      this.$refs["GroupForm"].validate(async valid => {
        if (valid) {
          this.Loadings.addDeptLoading = true;

          await addDept(this.GroupForm)
            .then(({ data }) => {
              this.Loadings.addDeptLoading = false;

              if (data.status === 0) {
                this.$message.success(data.msg);

                this.getDeptList();
              } else {
                this.$message.error(data.msg);
              }
            })

            .catch(() => {
              this.Loadings.addDeptLoading = false;
            });

          this.dialogFormVisible = false;
        }
      });
    },

    updateGroup() {
      //验证表单

      this.$refs["GroupForm"].validate(async valid => {
        if (valid) {
          this.Loadings.addDeptLoading = true;

          await putDept(this.GroupForm)
            .then(({ data }) => {
              this.Loadings.addDeptLoading = false;

              if (data.status === 0) {
                this.$message.success(data.msg);

                this.getDeptList();
              } else {
                this.$message.error(data.msg);
              }
            })

            .catch(() => {
              this.Loadings.addDeptLoading = false;
            });

          this.dialogFormVisible = false;
        }
      });
    },

    removeGroup(data) {
      this.$confirm("此操作将永久删除该部门?", "注意", {
        confirmButtonText: "删除",

        cancelButtonText: "取消",

        type: "warning"
      }).then(() => {
        removeDept({
          id: data.id,

          method: "delete"
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);

            this.getDeptList();
            this.ActiveGroup = null;
            this.GroupUsers = [];
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },

    searchGroup(value, data) {
      if (!value) return true;

      return data.name.indexOf(value) !== -1;
    },
    //打开“用户组”弹窗

    openGroupForm(type, node = null) {
      if (type === "add") {
        if (node) {
          this.DialogType = Object.assign(
            {},
            {
              title: "添加子部门",

              type
            }
          );

          this.GroupForm = Object.assign(
            {},
            {
              parentid: node.id
            }
          );
        } else {
          this.DialogType = Object.assign(
            {},
            {
              title: "添加部门",

              type
            }
          );

          this.GroupForm = {};
        }
      } else if (type === "update") {
        this.DialogType = Object.assign(
          {},
          {
            title: "修改部门信息",

            type
          }
        );

        this.GroupForm = Object.assign(
          {},
          {
            id: this.ActiveGroup.id,

            method: "put",

            name: this.ActiveGroup.name,

            chargerid: this.ActiveGroup.charger_id
          }
        );
      }

      this.dialogFormVisible = true;
      s["GroupForm"].resetFields();
    },
    pageRouter() {
      //  console.log(this.$route.query.id);
      getDept({
        id: this.$route.query.id
      })
        .then(({ data }) => {
          const msg = data.msg;
          this.handleGroupClick(msg);
        })
        .catch(err => {});
    },
      getAllUserlist() {
     
      getUserList().then(({ data }) => {
        this.UserList = [...data];
        
      })
     
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getDeptList();
     this.getAllUserlist();
    if (this.$route.query.id) {
      this.pageRouter();
    }
  },

  components: {
    usersTable,
    links
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped src="./profession.scss">
</style>
<style lang="scss">
.el-tree-node__content {
  border-bottom: 1px solid #dfe6ec;
  height: 35px;
  font: 12px;
}
</style>  