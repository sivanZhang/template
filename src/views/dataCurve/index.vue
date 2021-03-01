<template>
  <div id="dataCurve">
    <div class="title">
      <div class="title-text">数据诊断主界面</div>
    </div>
    <div class="home-lists">
      <div class="home-lists-row">
        <div class="row-bg">
        <el-row :gutter="30">
          <el-col  :lg="12">
            <router-link :to="{name:'pumpUnit'}">
              <el-card shadow="always">
                <div class="list-item">
                  <div class="item-img">
                    <img class="img" src="@/assets/pumpUnit.png" alt />
                  </div>
                  <div class="item-text">抽油机</div>
                </div>
              </el-card>
            </router-link>
          </el-col>
          <el-col  :lg="12">
            <router-link :to="{name:'screwPump'}">
              <el-card shadow="always">
                  <div class="list-item">
                  <div class="item-img">
                      <img style="width:60px;height:60px;margin:0 15px" src="@/assets/screwPump.png" alt />
                  </div>
                  <div class="item-text">螺杆泵</div>
                  </div>
              </el-card>
            </router-link>
          </el-col>
        </el-row>
        </div>
      </div>
      <div class="home-lists-row">
        <div class="row-bg">
        <el-row :gutter="30">
          <el-col  :lg="12">
            <router-link :to="{name:'elePump'}">
              <el-card shadow="always">
                <div class="list-item">
                  <div class="item-img">
                    <img style="width:65px;height:65px;margin:0 15px" src="@/assets/elePump.png" alt />
                  </div>
                  <div class="item-text">电泵</div>
                </div>
              </el-card>
            </router-link>
          </el-col>
          <el-col  :lg="12">
            <router-link :to="{name:'subScrewPump'}">
              <el-card shadow="always">
                <div class="list-item">
                  <div class="item-img">
                    <img class="img" src="@/assets/subScrewPump.png" alt />
                  </div>
                  <div class="item-text">电潜螺杆泵</div>
                </div>
              </el-card>
            </router-link>
          </el-col>
        </el-row>
        </div>
      </div>
      <div class="home-lists-row">
        <div class="row-bg">
        <el-row :gutter="30" >
          <el-col :lg="12">
            <router-link :to="{name:'energyPumpUnit'}">
              <el-card shadow="always">
                <div class="list-item">
                  <div class="item-img">
                    <img style="width:80px;height:80px;margin:0 5px" src="@/assets/energyPumpUnit.png" alt />
                  </div>
                  <div class="item-text">节能抽油机</div>
                </div>
            </el-card>
            </router-link>
          </el-col>
          <el-col :lg="12">
            <router-link :to="{name:'towPumpUnit'}">
              <el-card shadow="always">
                <div class="list-item">
                  <div class="item-img">
                    <img class="img" src="@/assets/towPumpUnit.png" alt />
                  </div>
                  <div class="item-text">塔式抽油机</div>
                </div>
              </el-card>
            </router-link>
          </el-col>
        </el-row>
        </div>
      </div>
    </div>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script>
export default {
};
</script>
<style lang="scss" scoped>
#dataCurve {
  .title {
    margin-top:10px;
    margin-bottom:70px;
    width:100%;
    text-align: center;
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
    padding-bottom: 20px;
    .row-bg{
      width: 65%;
    }
  }
  .list-item {
    display: flex;
    align-items: center;
    height:90px;
    .item-img {
      padding-left: 10px;
      .img{
         width: 90px;
         height: 90px
      }
    }
    .item-text {
      padding-left: 15px;
      font-size: 19px;
    }
  }
  
}
</style>
