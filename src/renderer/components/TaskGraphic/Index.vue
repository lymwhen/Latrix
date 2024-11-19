<template>
  <!-- <div style="width: 300px; height: 100px">{{ offset }}, {{ atomWG }}, {{ atomHG }}, {{ columnCount }}, {{ rowCount }}, {{ len }} , {{ zoom }} </div> -->
  <svg version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    class="svg-task-graphic"
    :width="width"
    :height="height"
    :viewBox="box">
    <g v-for="(row, index) in atoms" :key="`g-${index}`" >
      <mo-task-graphic-atom
        v-for="atom in row"
        :key="`atom-${atom.id}`"
        :status="atom.status"
        :width="atomWidth"
        :height="atomHeight"
        :radius="atomRadius"
        :x="atom.x"
        :y="atom.y"
      />
    </g>
  </svg>
</template>

<script>
  import Atom from './Atom'

  export default {
    name: 'mo-task-graphic',
    components: {
      [Atom.name]: Atom
    },
    props: {
      bitfield: {
        type: String,
        default: ''
      },
      outerWidth: {
        type: Number,
        default: 240
      },
      atomWidth: {
        type: Number,
        default: 10
      },
      atomHeight: {
        type: Number,
        default: 10
      },
      atomGutter: {
        type: Number,
        default: 3
      },
      atomRadius: {
        type: Number,
        default: 2
      },
      rowCount: {
        type: Number,
        default: 15
      }
    },
    computed: {
      len () {
        return this.bitfield.length
      },
      atomWG () {
        return this.atomWidth + this.atomGutter
      },
      atomHG () {
        return this.atomHeight + this.atomGutter
      },
      columnCount () {
        const { outerWidth, atomWidth, atomWG } = this
        const result = parseInt((outerWidth - atomWidth) / atomWG, 10) + 1
        return result
      },
      // bitfield表示了各个下载块的进度，每16KB被量化为15，存放在bitfield的一个字节中
      // 文件太大时（超过2GB），块过多导致UI长时间渲染无响应
      // 无论多大的文件都只放入rowCount*columnCount的网格中，一个格子表示的下载块数即为zoom
      zoom () {
        const { len, rowCount, columnCount } = this
        return Math.max(Math.ceil(len / (rowCount * columnCount), 10), 1)
      },
      offset () {
        const { outerWidth, atomWidth, atomWG, columnCount } = this
        const totalWidth = atomWG * (columnCount - 1) + atomWidth
        const result = (outerWidth - totalWidth) / 2
        return parseFloat(result.toFixed(2))
      },
      width () {
        const { atomWidth, atomWG, columnCount } = this
        const result = atomWG * (columnCount - 1) + atomWidth
        return parseInt(result, 10)
      },
      height () {
        const { atomHeight, atomHG, rowCount, offset } = this
        const result = atomHG * (rowCount - 1) + atomHeight + offset * 2
        return parseInt(result, 10)
      },
      box () {
        return `0 0 ${this.width} ${this.height}`
      },
      atoms () {
        const { len, columnCount, zoom } = this
        const result = []
        let row = []
        for (let i = 0; i < len; i += zoom) {
          const zi = parseInt(i / zoom)
          row.push(this.buildAtom(zi))

          if ((zi + 1) % columnCount === 0) {
            result.push(row)
            row = []
          }
        }
        if (row.length > 0) {
          result.push(row)
        }

        return result
      }
    },
    methods: {
      buildAtom (zIndex) {
        const { zoomSum, offset, atomWG, atomHG, columnCount, zoom } = this
        const hIndex = zIndex + 1
        const chIndex = zIndex % columnCount
        const rhIndex = parseInt((zIndex / columnCount), 10)
        const result = {
          id: `${hIndex}`,
          // 每个下载块被量化为15，所以对3求倍数，用5种颜色来表示，官方为4*4的组合，存在错误
          status: Math.floor(zoomSum(zIndex) / (3 * zoom)),
          x: chIndex * atomWG,
          y: offset + rhIndex * atomHG
        }

        return result
      },
      // 每个zoom中的所有下载块量化值之和
      zoomSum (zIndex) {
        const { bitfield, zoom, len } = this
        let sum = 0
        for (let i = zIndex * zoom; i < Math.min((zIndex + 1) * zoom, len); i++) {
          sum += parseInt(bitfield[i], 16)
        }
        return sum
      }
    }
  }
</script>
