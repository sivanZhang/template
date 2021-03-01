<!-- 资产侧栏 -->
<template>
  <div id="assetDrawer">
    
      <Header :project="project" @refreshList="refreshList">
        <span v-if="drawerType=='0'" slot="type">镜头类型</span>
      </Header>
      <assetsDrawer
        :project="project"
        :RemarksData="RemarksData"
        @refreshRemark="updateRemark()"
        @refresh_assetList="getAssetList()"
        ref="assetsDrawer"
        :assetJump="assetJump"
        :LinkAssetList="LinkAssetList"
        @jumpName="jumpName"
        :attrsList="attrsList"
        :customAttrs="customAttrs"
        @refresh_customAttrs="RefreshcustomAttrs"
        :attrsTypeNum="attrsTypeNum"
        :pro_type="pro_type"
        :authAsset="authAsset"
      />
    
  </div>
</template>

<script>
import assetsDrawer from "@/views/assetsManagement/components/assetsDrawer";
import Header from "@/components/projectDrawer/components/Header";
import * as HTTP from "@/api/assets";

import { getRemark } from "@/api/remark";
import { searchBind, getAttrsEntityList } from "@/api/attrs";
export default {
  
  components: { assetsDrawer, Header },
  data() {
    return {
      drawerType:null,
      pro_type: null,
      project: null,
      RemarksData: [],
      attrsList: [],
      customAttrs: [],
      attrsTypeNum: null,
      LinkAssetList: [],
    };
  },
  props: [ "assetJump", "authAsset"],
  watch: {},
  methods: {
    //展示侧栏
    show(id) {
      
      this.pro_type = this.$route.query.type;
      HTTP.queryAssets({ id }).then(({ data }) => {
        this.project = { ...[...data.msg][0], id };
        this.drawerType = this.project.asset_type;
        [...data.msg].forEach(item => {
              if (!item.link.length) {
                this.LinkAssetList.push(item);
              }
            });
      });
      this.$refs.assetsDrawer.getLinkList(id);
      this.$refs.assetsDrawer.getAssetTask(id);
      const msg = {
        appid: id,
        apptype: 5
      };
      getRemark(msg).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
      searchBind({ entity_type: 5 }).then(({ data }) => {
        this.attrsList = [...data.msg];
      });
      getAttrsEntityList({ entity_id: id, entity_type: 5 }).then(({ data }) => {
        this.customAttrs = [...data.msg];
        this.attrsTypeNum = 5;
      });
    },
    updateRemark() {
      getRemark({
        appid: this.project.id,
        apptype: 5
      }).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
    },
    getAssetList() {
      this.$emit("refresh_assetList");
    },
    jumpName(val) {
      this.$emit("jumpName", val);
    },
    RefreshcustomAttrs() {
      getAttrsEntityList({ entity_id: this.project.id, entity_type: 5 }).then(
        ({ data }) => {
          this.customAttrs = [...data.msg];
          this.attrsTypeNum = 5;
        }
      );
    },
    refreshList(){
      this.$emit("refresh_assetList")
    }

  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>