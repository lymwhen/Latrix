<template>
  <!-- 调整下载任务样式 -->
  <div class="ls-task-item-wrapper">
    <div :key="task.gid" class="task-item" v-on:dblclick="onDbClick">
      <div class="task-name" :title="taskFullName">
        <span>{{ taskFullName }}</span>
      </div>
      <mo-task-item-actions mode="LIST" :task="task" />
      <mo-task-progress-info :task="task" />
    </div>
    <div class="la-task-progress" v-if="task.status !== TASK_STATUS.COMPLETE" :style="{ width: `${(Number(task.completedLength) / Number(task.totalLength)) * 100}%` }"></div>
  </div>
</template>

<script>
  import { checkTaskIsSeeder, getTaskName } from '@shared/utils'
  import { TASK_STATUS } from '@shared/constants'
  import { openItem, getTaskFullPath } from '@/utils/native'
  import TaskItemActions from './TaskItemActions'
  import TaskProgress from './TaskProgress'
  import TaskProgressInfo from './TaskProgressInfo'

  export default {
    name: 'mo-task-item',
    components: {
      [TaskItemActions.name]: TaskItemActions,
      [TaskProgress.name]: TaskProgress,
      [TaskProgressInfo.name]: TaskProgressInfo
    },
    props: {
      task: {
        type: Object
      }
    },
    data () {
      return {
        TASK_STATUS: TASK_STATUS
      }
    },
    computed: {
      taskFullName () {
        return getTaskName(this.task, {
          defaultName: this.$t('task.get-task-name'),
          maxLen: -1
        })
      },
      taskName () {
        return getTaskName(this.task, {
          defaultName: this.$t('task.get-task-name')
        })
      },
      isSeeder () {
        return checkTaskIsSeeder(this.task)
      },
      taskStatus () {
        const { task, isSeeder } = this
        if (isSeeder) {
          return TASK_STATUS.SEEDING
        } else {
          return task.status
        }
      }
    },
    methods: {
      onDbClick () {
        const { status } = this.task
        const { COMPLETE, WAITING, PAUSED } = TASK_STATUS
        if (status === COMPLETE) {
          this.openTask()
        } else if ([WAITING, PAUSED].includes(status) !== -1) {
          this.toggleTask()
        }
      },
      async openTask () {
        const { taskName } = this
        this.$msg.info(this.$t('task.opening-task-message', { taskName }))
        const fullPath = getTaskFullPath(this.task)
        const result = await openItem(fullPath)
        if (result) {
          this.$msg.error(this.$t('task.file-not-exist'))
        }
      },
      toggleTask () {
        this.$store.dispatch('task/toggleTask', this.task)
      }
    }
  }
</script>

<style lang="scss">
// 调整下载任务样式
.ls-task-item-wrapper {
  position: relative;
  border-radius: 3px;
  margin-bottom: 12px;
  z-index: 2;
  overflow: hidden;
  box-shadow: 1px 1px 3px 1px #00000014;

  .la-task-progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: $--subnav-active-text-color;
    opacity: .1;
    z-index: -1;
    transition: width .9s linear;
  }
}
.task-item {
  position: relative;
  display: flex;
  padding: 6px 12px;
  border: 2px solid #FFFFFF00;
  transition: $--border-transition-base;
  align-items: center;
  min-height: 26px;

  .task-item-actions {
    display: none;
  }
  .task-progress-info {
    display: inline-flex;
  }

  &:hover {
    border: 2px solid $--task-item-hover-border-color;

    .task-item-actions {
      display: inline;
    }
    .task-progress-info {
      display: none;
    }
  }
}
.selected .task-item {
  border-color: $--task-item-hover-border-color;
}
.task-name {
  color: #505753;
  word-break: break-all;
  flex: 1;
  &> span {
    font-size: 14px;
    line-height: 20px;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
