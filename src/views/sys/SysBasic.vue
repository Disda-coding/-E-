<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="部门管理" name="DepMana"><DepMana/></el-tab-pane>
      <el-tab-pane label="职位管理" name="PosMana"><PosMana/></el-tab-pane>
      <el-tab-pane label="职称管理" name="JobLevelMana"><JobLevelMana/></el-tab-pane>
      <el-tab-pane label="奖惩规则" name="EcMana"><EcMana/></el-tab-pane>
      <el-tab-pane label="权限组" name="PositionMana"><PermissManage/></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import DepMana from "@/components/sys/basic/DepManage";  // 部门管理
import EcMana from "@/components/sys/basic/EcManage"; // 奖惩规则
import JobLevelMana from "@/components/sys/basic/JobLevelManage"; // 职称管理
import PermissManage from "@/components/sys/basic/PermissManage"; // 权限组
import PosMana from "@/components/sys/basic/PosManage"; // 职位管理

export default {
  name: "SysBasic",
  components:{
    JobLevelMana,  // "job":joblevelMan 起别名
    DepMana,
    EcMana,
    PermissManage,
    PosMana
  },
  data() {
    return {
      activeName: 'DepMana' // 激活项
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
