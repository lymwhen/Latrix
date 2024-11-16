<template>
  <nav class="subnav-inner la-nav-full">
    <!-- 修改logo -->
    <h3 class="la-logo-h3">{{ 'Latrix' }}</h3>
    <ul>
      <li
        @click="() => nav('active')"
        :class="[ current === 'active' ? 'active' : '' ]"
      >
        <i class="subnav-icon">
          <mo-icon name="task-start" width="20" height="20" />
        </i>
        <span>{{ $t('task.active') }}</span>
      </li>
      <li
        @click="() => nav('waiting')"
        :class="[ current === 'waiting' ? 'active' : '' ]"
      >
        <i class="subnav-icon">
          <mo-icon name="task-pause" width="20" height="20" />
        </i>
        <span>{{ $t('task.waiting') }}</span>
      </li>
      <li
        @click="() => nav('stopped')"
        :class="[ current === 'stopped' ? 'active' : '' ]"
      >
        <i class="subnav-icon">
          <mo-icon name="task-stop" width="20" height="20" />
        </i>
        <span>{{ $t('task.stopped') }}</span>
      </li>
    </ul>
    <!-- 将添加、设置、关于按钮放到菜单栏 -->
    <ul class="la-nav-ul-bottom">
      <li
        @click="showAddTask()"
        class="stop"
      >
        <i class="subnav-icon">
          <mo-icon name="menu-add" width="20" height="20" />
        </i>
        <span>{{ '添加任务' }}</span>
      </li>
      <li
        @click="navPage('/preference')"
        class="stop"
      >
        <i class="subnav-icon">
          <mo-icon name="la-menu-preference" width="20" height="20" />
        </i>
        <span>{{ '设置' }}</span>
      </li>
      <li
        @click="showAboutPanel"
        class="stop"
      >
        <i class="subnav-icon">
          <mo-icon name="la-menu-about" width="20" height="20" />
        </i>
        <span>{{ '关于' }}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
  import '@/components/Icons/task-start'
  import '@/components/Icons/task-pause'
  import '@/components/Icons/task-stop'
  import '@/components/Icons/la-menu-about'
  import '@/components/Icons/la-menu-preference'
  import { ADD_TASK_TYPE } from '@shared/constants'

  export default {
    name: 'mo-task-subnav',
    props: {
      current: {
        type: String,
        default: 'active'
      }
    },
    computed: {
      title () {
        return this.$t('subnav.task-list')
      }
    },
    methods: {
      showAddTask (taskType = ADD_TASK_TYPE.URI) {
        console.log(ADD_TASK_TYPE.URI)
        console.log(taskType)
        this.$store.dispatch('app/showAddTaskDialog', taskType)
      },
      showAboutPanel () {
        this.$store.dispatch('app/showAboutPanel')
      },
      navPage (page) {
        this.$router.push({
          path: page
        }).catch(err => {
          console.log(err)
        })
      },
      nav (status = 'active') {
        this.$router.push({
          path: `/task/${status}`
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
.la-nav-full {
  position: relative;
  height: calc(100% - 50px);

  .la-nav-ul-bottom {
    position: absolute;
    bottom: 0;
    width: calc(100% - 32px);
  }
}
</style>
