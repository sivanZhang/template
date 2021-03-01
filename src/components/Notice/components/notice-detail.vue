<template>
  <div id="notiec-detail">
    <div>
      <el-button
        type="danger"
        @click="delNotices"
        :disabled="this.multipleSelection.length === 0"
      >批量删除</el-button>
      <!--disabled值动态显示，默认为true,当选中复选框后值为false-->
      <el-button
        @click="updateIsReads"
        type="primary"
        :disabled="this.multipleSelection.length === 0"
        style="margin-right:20px;"
      >标记为已读</el-button>
      <el-radio v-model="ifRead" label="1" @change="searchNotice()" style="margin-right:5px;" >已读</el-radio>
      <el-radio v-model="ifRead" label="0" @change="searchNotice()">未读</el-radio>
    </div>

    <el-table
      :data="noticeList"
      style="width: 100%;margin-top:5px;"
      ref="multipleTable"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      @row-click="updateIsRead"
    >
      <el-table-column type="expand" width="15">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
             
            <el-row>
              <el-form-item label="通知内容:">
                <span>{{ props.row.title }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="时间:">
                <span>{{ props.row.date|dateFormat }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="是否已读:">
                <span>{{ props.row.read |isRead }}</span>
              </el-form-item>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="30"></el-table-column>
       
      <el-table-column label="通知" :min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.title}}</template>
      </el-table-column>
     
      <el-table-column label="时间" :min-width="40">
        <template slot-scope="scope">{{scope.row.date|dateTimeFormat}}</template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="notice.length"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import * as HTTP from "@/api/notice";
export default {
  name: "NoticeDetail",
  props: ["notice"],
  data() {
    return {
      ifRead: "0",
      currentPage: 1,
      pageSize:10,
      pageSizeList: [10, 30, 50, 100],
      multipleSelection: []
    };
  },
  computed: {
    noticeList() {
      return (
        this.notice.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        ) || []
      );
    }
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //点击消息触发，参数为点击的消息数据
    handelClickNoticeItem({ url, task_id, category }) {
      // category == 1 时候跳转到我的任务后需要打开任务的侧边栏，  在stroe中传递 id识别
      if (category == 1) {
        this.$store.commit("mine/setTaskId", task_id);
      }
      // 关闭notice的抽屉
      this.$store.commit("notice/SET_CARDSHOW", false);
      this.$router.push(url);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleChange(val) {
      console.log(val);
    },
    //修改是否已读
    updateIsRead(row) {
      if (row.read === 0) {
        row.read = 1;
      }
      HTTP.putNotice({
        method: "put",
        ids: row.id,
        read: row.read
      }).then(({ data }) => {
        if (data.status === 0) {
          // this.$message.success(data.msg);
          // this.$emit("getNoticeDetail");
          this.searchNotice()
        } else {
          //this.$message.error(data.msg);
        }
      });
    },
    updateIsReads() {
      const ids = this.multipleSelection.map(item => item.id).join(",");
      HTTP.putNotice({
        method: "put",
        ids: ids,
        read: 1
      }).then(({ data }) => {
        if (data.status === 0) {
          // this.$message.success(data.msg);
          this.$emit("getNoticeDetail");
        } else {
          // this.$message.error(data.msg);
        }
      });
    },
    //查询已读未读
    searchNotice() {
      let noti = {
        read: this.ifRead
      };
      if (this.ifRead == 1) {
        this.$store.dispatch('notice/get_Notice',noti )
      } else {
        if (this.ifRead == 0) {
        this.$store.dispatch('notice/get_Notice',noti)
        }
      }
    },
    //批量删除通知
    delNotices() {
      const ids = this.multipleSelection.map(item => item.id).join(",");
      //console.log(ids);
      this.$confirm("确定删除？", "注意", {
        confirmButtonText: "删除",

        concelButtonText: "取消",

        type: "warning"
      }).then(() => {
        HTTP.removeNotice({
          ids: ids,
          method: "delete"
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.$refs.multipleTable.clearSelection();
            this.$emit("getNoticeDetail");
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.item {
  position: static;
  margin-left: -10px;
  margin-top: -16px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
</style> 