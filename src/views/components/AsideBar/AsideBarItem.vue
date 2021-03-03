<template functional>
  <el-submenu :index="props.route.name">
    <template slot="title">
      <i class="iconfont" style="font-size:16px;margin-right:10px" :class="props.route.meta.icon"></i>
      <span>{{props.route.meta.title}}</span>
    </template>
    <template v-if="props.route.children && props.route.children.length">
      <template v-for="item of props.route.children.filter(t=>!t.hidden)">
        <template v-if="item.children!== undefined && item.children.length">
          <AsidebarItem :key="item.name" :aside-bar-list="item" />
        </template>
        <template v-else>
          <el-menu-item :key="item.name" :index="item.name">{{item.meta.title}}</el-menu-item>
        </template>
      </template>
    </template>
  </el-submenu>
</template>
