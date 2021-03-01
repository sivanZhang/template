<template>
  <div id="electricParamater">
    <div class="title">
      <div class="title-text">电参示功图界面</div>
    </div>
    <div class="home-lists">
      <div class="home-lists-row">
        <div class="row-bg">
        <el-row :gutter="30">
          <el-col  :lg="12">
            <router-link :to="{name:'signalElecticParam'}">
              <el-card shadow="always" class="list-item">
                <div class="list-item">
                  <div class="item-img">
                    <img class="img" src="@/assets/electric.png" alt />
                  </div>
                  <div class="item-text">单独调用电参及载荷示功图曲线</div>
                </div>
              </el-card>
            </router-link>
          </el-col>
          <el-col  :lg="12">
            <router-link :to="{name:'manual-automatic'}">
              <el-card shadow="always" class="list-item">
                <div class="list-item">
                  <div class="item-img">
                    <img class="img" src="@/assets/auto_manual.png" alt />
                  </div>
                  <div class="item-text">自动绘制电参数示功图显示</div>
                </div>
              </el-card>
            </router-link>
          </el-col>
          <!-- <el-col  :lg="12">
            <router-link :to="{name:'manualDrawing',query:{type:1}}">
              <el-card shadow="always" class="list-item">
                <div class="list-item">
                  <div class="item-img">
                    <img class="img" src="@/assets/manual.png" alt />
                  </div>
                  <div class="item-text">手动绘制电参数示功图</div>
                </div>
              </el-card>
            </router-link>
          </el-col> -->
        </el-row>
        </div>
      </div>
      <!-- <div class="home-lists-row">
        <div class="row-bg">
        <el-row :gutter="30">
          <el-col  :lg="12">
            <router-link :to="{name:'manual-automatic'}">
              <el-card shadow="always" class="list-item">
                <div class="list-item">
                  <div class="item-img">
                    <img class="img" src="@/assets/auto_manual.png" alt />
                  </div>
                  <div class="item-text">自动绘制电参数示功图显示</div>
                </div>
              </el-card>
            </router-link>
          </el-col>
          <el-col  :lg="12">
            <router-link :to="{name:'manualDrawing',query:{type:2}}">
              <el-card shadow="always" class="list-item">
                <div class="list-item">
                  <div class="item-img">
                    <img class="img" src="@/assets/auto.png" alt />
                  </div>
                  <div class="item-text">自动绘制电参数示功图</div>
                </div>
              </el-card>
            </router-link>
          </el-col>
        </el-row>
        </div>
      </div> -->
      <div class="home-lists-row">
        <div class="row-bg">
        <el-row :gutter="30" >
          <el-col :lg="12">
            <router-link :to="{name:'ele-parameter'}">
              <el-card shadow="always" class="list-item">
                <div class="list-item">
                  <div class="item-img">
                    <img class="img" src="@/assets/multiplyele.png" alt />
                  </div>
                  <div class="item-text">多个历史电参示功图曲线</div>
                </div>
            </el-card>
            </router-link>
          </el-col>
          <el-col :lg="12">
            <router-link :to="{name:'indicatorDiagram'}">
              <el-card shadow="always" class="list-item">
                <div class="list-item">
                  <div class="item-img">
                    <img class="img" src="@/assets/multiplyload.png" alt />
                  </div>
                  <div class="item-text">多个历史载荷示功图曲线</div>
                </div>
              </el-card>
            </router-link>
          </el-col>
        </el-row>
        </div>
      </div>
     <div style="margin-top:50px"></div>
    </div>
  </div>
</template>
<script>
export default {
};
</script>
<style lang="scss" scoped>
#electricParamater {
  .title {
    margin-top:10px;
    margin-bottom:70px;
    display: flex;
    justify-content: center;
    .title-text {
      font-weight: bold;
      font-size: 20px;
    }
  }
  .home-lists-row {
    margin:0px 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 25px;
    .row-bg{
      width: 90%;
    }
  }
  .list-item {
    display: flex;
    align-items: center;
    .item-img {
      padding-left: 40px;
      padding-right: 15px;
      .img{
         width: 76px;
         height: 76px
      }
    }
    .item-text {
      padding-left: 15px;
      font-size: 19px;
    }
  }
  
}
</style>