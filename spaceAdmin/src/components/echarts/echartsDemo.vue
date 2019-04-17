<template>
  <div>
    <div ref="main" style="width: 600px;height:400px;"></div>
    <div ref="pie" style="width: 600px;height:400px;"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  data: () => ({
    echarts,
    data: null
  }),
  mounted () {
    this.setBarChart()
    this.setPieChart()
  },
  // 条形图示例
  methods: {
    setBarChart () {
      const spliceData = (type) => {
        const arr = []
        const obj = this.data[type]
        arr.push(obj.looknum, obj.lookplay, obj.lookuser)
        return arr
      }
      const myChart = echarts.init(this.$refs['main'])
      myChart.showLoading({
        text: 'loading',
        color: '#c23531',
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0)',
        zlevel: 0
      })
      this.loadAll(() => {
        myChart.hideLoading()
        const option = {
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          legend: {
            data: ['永久', '30天内', '7天内']
          },
          xAxis: {
            data: ['永久', '浏览', '访问']
          },
          yAxis: {},
          series: [{
            name: '永久',
            type: 'bar',
            data: spliceData(0)
          }, {
            name: '30天内',
            type: 'bar',
            data: spliceData(1)
          }, {
            name: '7天内',
            type: 'bar',
            data: spliceData(2)
          }]
        }
        myChart.setOption(option)
      })
    },
    // 扇形图示例
    setPieChart () {
      const myChart = echarts.init(this.$refs['pie'])
      myChart.showLoading()
      this.loadAll(() => {
        myChart.hideLoading()
        const option = {
          title: {
            text: '浏览量扇形图demo'
          },
          legend: {
            data: ['永久', '30天内', '7天内']
          },
          tooltip: {},
          series: [
            {
            // name: '浏览',
              type: 'pie',
              data: [
                {value: this.data[0].lookplay, name: '永久'},
                {value: this.data[1].lookplay, name: '30天内'},
                {value: this.data[2].lookplay, name: '7天内'}
              ]
            }
          ]
        }
        myChart.setOption(option)
      })
    },
    loadData (type) {
      return this.$http.post('index/index/countbytime', {
        'type': type,
        'userid': this.$store.state.userInfo.id,
        'phone': this.$store.state.userInfo.phone
      })
    },
    loadAll (callback) {
      this.$http.all([this.loadData(0), this.loadData(1), this.loadData(2)]).then(
        this.$http.spread((value1, value2, value3) => {
          this.data = [value1.data.data, value2.data.data, value3.data.data]
          callback()
        })
      ).catch(err => {
        console.log(err)
        this.$Message.error('出错了，重新刷新')
      })
    }
  }
}
</script>
