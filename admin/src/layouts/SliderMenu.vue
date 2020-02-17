<template>
<div>
  <a-menu
    style="width: 240px;background: #2A3C57"
    :defaultSelectedKeys="['1']"
    :defaultOpenKeys="['sub1']"
    mode="inline"
    :theme="theme"
    :selectedKeys="[current]"
    @click="handleClick"
  >
    <a-menu-item key="game">
      <router-link to="/game">赛事管理</router-link>
    </a-menu-item>
    <a-menu-item key="equipDistribute">
      <router-link to="/equipDistribute">设备分配</router-link>
    </a-menu-item>
    <a-menu-item key="defend">
      <router-link to="/defend">硬件维护</router-link>
    </a-menu-item>
  </a-menu>
</div>
</template>
<script>
export default {
  data () {
    return {
      current: 'game',
      theme: 'dark'
    }
  },
  mounted () {
    let path = this.$route.path.substring(1)
    this.current = path.split('/')[0]
  },
  methods: {
    handleClick (e) {
      // console.log('click ', e)
      this.current = e.key
    }
  }
}
</script>
<style lang="scss" >
  .ant-menu-vertical .ant-menu-item, .ant-menu-vertical-left .ant-menu-item, .ant-menu-vertical-right .ant-menu-item, .ant-menu-inline .ant-menu-item, .ant-menu-vertical .ant-menu-submenu-title, .ant-menu-vertical-left .ant-menu-submenu-title, .ant-menu-vertical-right .ant-menu-submenu-title, .ant-menu-inline .ant-menu-submenu-title{
    margin-top: 0
  }
  .ant-menu.ant-menu-dark .ant-menu-item-selected, .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected{
    background-color: #324C6E
  }
</style>
