<template>
  <mo-drag-select
    class="task-list"
    v-if="taskList.length > 0"
    attribute="attr"
    @change="handleDragSelectChange"
  >
    <div
      v-for="item in taskList"
      :key="item.gid"
      :attr="item.gid"
      :class="getItemClass(item)"
    >
      <mo-task-item
        :task="item"
      />
    </div>
  </mo-drag-select>
  <div class="no-task" v-else>
    <div class="no-task-inner">
      <!-- 调整无任务时图片 -->
      <mo-icon name="la-no-task" width="100" height="100" /><br><br>
      {{ $t('task.no-task') }}
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { cloneDeep } from 'lodash'
  import DragSelect from '@/components/DragSelect/Index'
  import TaskItem from './TaskItem'
  import '@/components/Icons/la-no-task'

  export default {
    name: 'mo-task-list',
    components: {
      [DragSelect.name]: DragSelect,
      [TaskItem.name]: TaskItem
    },
    data () {
      const selectedList = cloneDeep(this.$store.state.task.selectedList) || []
      return {
        selectedList
      }
    },
    computed: {
      ...mapState('task', {
        taskList: state => state.taskList,
        selectedGidList: state => state.selectedGidList
      })
    },
    methods: {
      handleDragSelectChange (selectedList) {
        this.selectedList = selectedList
        this.$store.dispatch('task/selectTasks', cloneDeep(selectedList))
      },
      getItemClass (item) {
        const isSelected = this.selectedList.includes(item.gid)
        return {
          selected: isSelected
        }
      }
    },
    watch: {
      selectedGidList (newVal) {
        this.selectedList = newVal
      }
    }
  }
</script>

<style lang="scss">
.task-list {
  padding: 16px 16px 64px;
  min-height: 100%;
  box-sizing: border-box;
}
.no-task {
  position: relative;
  display: flex;
  height: 100%;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #555;
  user-select: none;
}
.no-task-inner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: .6;
}
</style>
