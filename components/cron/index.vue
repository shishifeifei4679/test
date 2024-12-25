<template lang="html">
  <div class="cron" :val="value_">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$i18n.t('components.s')" name="s">
        <second-and-minute v-model="sVal" :lable="$i18n.t('components.s')"></second-and-minute>
      </el-tab-pane>
      <el-tab-pane :label="$i18n.t('components.m')" name="m">
        <second-and-minute v-model="mVal" :lable="$i18n.t('components.m')"></second-and-minute>
      </el-tab-pane>
      <el-tab-pane :label="$i18n.t('components.h')" name="h">
        <hour v-model="hVal" :lable="$i18n.t('components.h')"></hour>
      </el-tab-pane>
      <el-tab-pane :label="$i18n.t('components.d')" name="d">
        <day v-model="dVal" :lable="$i18n.t('components.d')"></day>
      </el-tab-pane>
      <el-tab-pane :label="$i18n.t('components.month')" name="month">
        <month v-model="monthVal" :lable="$i18n.t('components.month')"></month>
      </el-tab-pane>
      <el-tab-pane :label="$i18n.t('components.week')" name="week">
        <week v-model="weekVal" :lable="$i18n.t('components.week')"></week>
      </el-tab-pane>
      <el-tab-pane :label="$i18n.t('components.year')" name="year">
        <year v-model="yearVal" :lable="$i18n.t('components.year')"></year>
      </el-tab-pane>
    </el-tabs>
    <!-- table -->
    <el-table :data="tableData" size="mini" border style="width: 100%">
      <el-table-column prop="sVal" :label="$i18n.t('components.s')" width="70"> </el-table-column>
      <el-table-column prop="mVal" :label="$i18n.t('components.m')" width="70"> </el-table-column>
      <el-table-column prop="hVal" :label="$i18n.t('components.h')" width="70"> </el-table-column>
      <el-table-column prop="dVal" :label="$i18n.t('components.d')" width="70"> </el-table-column>
      <el-table-column prop="monthVal" :label="$i18n.t('components.month')" width="70"> </el-table-column>
      <el-table-column prop="weekVal" :label="$i18n.t('components.week')" width="70"> </el-table-column>
      <el-table-column prop="yearVal" :label="$i18n.t('components.year')"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import SecondAndMinute from "./secondAndMinute";
import hour from "./hour";
import day from "./day";
import month from "./month";
import week from "./week";
import year from "./year";
export default {
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      //
      activeName: "s",
      sVal: "",
      mVal: "",
      hVal: "",
      dVal: "",
      monthVal: "",
      weekVal: "",
      yearVal: "",
    };
  },
  watch: {
    value(a, b) {
      // console.log(a, b);
      // this.updateVal();
    },
  },
  computed: {
    tableData() {
      return [
        {
          sVal: this.sVal,
          mVal: this.mVal,
          hVal: this.hVal,
          dVal: this.dVal,
          monthVal: this.monthVal,
          weekVal: this.weekVal,
          yearVal: this.yearVal,
        },
      ];
    },
    value_() {
      if (!this.dVal && !this.weekVal) {
        return "";
      }
      if (this.dVal === "?" && this.weekVal === "?") {
        this.$message.error($i18n.t('components.cronMsg1'));
      }
      if (this.dVal !== "?" && this.weekVal !== "?") {
        this.$message.error($i18n.t('components.cronMsg2'));
      }
      let v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`;
      if (v !== this.value) {
        this.$emit("input", v);
      }
      return v;
    },
  },
  methods: {
    updateVal() {
      if (!this.value) {
        return;
      }
      let arrays = this.value.split(" ");
      this.sVal = arrays[0];
      this.mVal = arrays[1];
      this.hVal = arrays[2];
      this.dVal = arrays[3];
      this.monthVal = arrays[4];
      this.weekVal = arrays[5];
      this.yearVal = arrays[6];
    },
  },
  created() {
    // this.updateVal();
  },
  components: {
    SecondAndMinute,
    hour,
    day,
    month,
    week,
    year,
  },
};
</script>

<style lang="css">
.cron {
  text-align: left;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
</style>
