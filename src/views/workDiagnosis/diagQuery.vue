<template>
  <div id="diagQuery">
    <div class="diag-title">
      <div class="title-text">诊断查询处理界面</div>
    </div>
    <div class="diag-header">
      <el-card shadow="never">
        <el-row>
          <el-col :sm="5" :lg="5" class="col-bg-1">
            井名：
            <el-select
              v-model="wellName"
              filterable
              placeholder="请选择井名"
              style="width:150px;"
              @change="getWellDetails()"
            >
              <el-option
                v-for="item of wellList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :sm="5" :lg="5" class="col-bg" v-if="this.date==''">处置时间：{{"未处置"}}</el-col>
          <el-col :sm="5" :lg="5" class="col-bg" v-else>处置时间：{{time|dateTimeFormat}}</el-col>
          <el-col :sm="4" :lg="4" class="col-bg">
            油井类别：
            <span v-if="wellDetail.well_type == 0">抽油机</span>
            <span v-if="wellDetail.well_type == 1">螺杆泵</span>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="diag-container">
      <el-row :gutter="10">
        <el-col :lg="11" :sm="11">
          <el-row>
            <el-card shadow="never" style="height:610px">
              <div style="display:flex;margin:10px">
                <span style="width:80px">诊断种类：</span>
                <span v-if="firstEntry == true">{{alarmDetail.title}}</span>
                <span v-else>
                  <span v-if="diagTitle">
                    <span v-if="current==true">
                      {{typeTitle}}
                    </span>
                    <span v-else>
                      {{diagTitle}}
                    </span>
                  </span>
                  <span v-else>{{"无诊断"}}</span>
                </span>
              </div>

                 <optionDialog
                   :auth="auth"
                   :wellDetail="wellDetail"
                   :wellName="wellName"
                   :name="name"
                   :handleStatus="handleStatus"
                   :warningId="warningId"
                   :promote="promote"
                   :warningindex="warningindex"
                   @getHistoryAlarm="getHistoryAlarm"
                />

            </el-card>
          </el-row>
        
        </el-col>
        <el-col :lg="13" :sm="13">
          <el-card shadow="never"  
          :body-style="{overflowY:'scroll',height:'610px'}"
          style="height:610px">
            <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="典型示功图" name="first"  v-if="wellDetail.well_type == 0">
                <div v-for="(item,index) in imageList" :key="index">
                  <img style="margin-left:0px;width:495px;height:330px" :src="item.url" alt />
                </div>
              </el-tab-pane>
              <el-tab-pane label="处置过程" name="second" >
                <handleProcess ref="handleProcess"
                  :processList="processList" 
                  :auth="auth" 
                  :show="show"
                  @getHistoryAlarm="getHistoryAlarm"
                  @change="change"/>
              </el-tab-pane>
              <el-tab-pane label="电参力和载荷力历史曲线图" name="third">
                <historyChart ref="historychart"
                :wellName="wellName"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
      <adjustDialog 
      :auth="auth" 
      :orderList="orderList" 
      :wellName="wellName"
      :number="number"
      :wellDetail="wellDetail"
      @getWellDetails="getWellDetails"
      @getOrderList="getOrderList"
      />
    </div>
    <div style="margin-top:50px"></div>
  </div>
</template>
<script src="./diagHandle.js">
</script>
<style lang="scss" scoped src="./diagQuery.scss">
  
</style>
<style lang="scss" scoped  >
</style>