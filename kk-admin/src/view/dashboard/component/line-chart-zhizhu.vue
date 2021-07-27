<template>
  <div id="line"></div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { Line } from '@antv/g2plot'

export default {
  name: 'Line',
  data() {
    return {
      data: [
        { month: '0721', value: 100, type: '收录' },
        { month: '0722', value: 80, type: '收录' },
        { month: '0723', value: 100, type: '收录' },
        { month: '0724', value: 70, type: '收录' },
        { month: '0725', value: 120, type: '收录' },
        { month: '0726', value: 80, type: '收录' },
        { month: '0727', value: 60, type: '收录' },
        { month: '0728', value: 50, type: '收录' },
        { month: '0729', value: 186, type: '收录' },
        { month: '0730', value: 180, type: '收录' },
      ],
    }
  },
  mounted() {
    new Line('line', {
      title: {
        visible: true,
        text: '蜘蛛趋势分析',
      },
      data: this.data,
      forceFit: true,
      seriesField: 'type',
      xField: 'month',
      yField: 'value',
      label: 'value',
      smooth: true,
      color: ['#4577FF', '#00C292', '#FEC108'],
      legend: {
        visible: true,
        position: 'top-right',
      },
    }).render()
  },
}
</script>

<style scoped></style>
