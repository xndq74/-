<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-uploader :after-read="afterRead">
            <van-image round class="avatar" :src="photo" />
          </van-uploader>
        </template>
      </van-cell>
      <van-cell title="名称" is-link @click="ShowDialog">
        <template #default>
          <span>{{ name }}</span>
        </template>
      </van-cell>
      <van-cell title="生日" is-link @click="showDateTimePicker">
        <template #default>
          <span>{{ userEditorInfo.birthday }}</span>
        </template>
      </van-cell>
    </van-cell-group>
    <!--  -->
    <van-dialog
      v-model="DialogShow"
      title="修改名称"
      show-cancel-button
      :before-close="validationUserName"
    >
      <van-field
        v-model="userName"
        maxlength="7"
        placeholder="请输入名称"
        input-align="center"
        v-GetFocus
      />
    </van-dialog>
    <van-popup v-model="showPopup" position="bottom" :style="{ height: '50%' }">
      <template>
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          @cancel='showPopup = false'
          @confirm='UpdateBirthday'
          :min-date="minDate"
          :max-date="maxDate"
        />
      </template>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Notify } from 'vant'
import { formatDate } from '@/utils/data'
export default {
  name: 'UserEdit',
  created () {
    this.GetUserEditorInfo()
  },
  data () {
    return {
      userEditorInfo: {},
      DialogShow: false,
      showPopup: false,
      userName: '',
      // 最小时间
      minDate: new Date(1950, 0, 1),
      // 最大时间
      maxDate: new Date(),
      // 现在选中时间
      currentDate: new Date(2021, 0, 17)
    }
  },
  methods: {
    // 获取编辑用户信息
    async GetUserEditorInfo () {
      const result = await this.$Api.user.GetUserEditor()
      if (result.status === 200) {
        this.userEditorInfo = result.data.data
      }
    },
    // 文件上传完毕后会触发 after-read 回调函数，获取到对应的 file 对象。
    async afterRead (file) {
      // 此时可以自行将文件上传至服务器 需要用FormData() 打包一下上传不然服务器不认识，应该是打包成file格式
      const fd = new FormData()
      fd.append('photo', file.file)
      const result = await this.$Api.user.SetUserPhoto(fd)
      if (result.status === 200) {
        this.$store.commit('user/SET_PHOTO', result.data.data.photo)
      } else {
        console.log(Promise(new Error(result.message)))
      }
    },
    // 编辑名称
    ShowDialog () {
      this.DialogShow = true
      this.userName = this.name
    },
    // 关闭前验证用户名称是否符合规则
    async validationUserName (action, done) {
      // 直接判断用户点击的按钮如果是确定判断是否符合规则，符合就发送请求
      if (action === 'confirm') {
        if (/^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/.test(this.userName)) {
          const result = await this.$Api.user.SetUserInfo({
            name: this.userName
          })
          if (result.status === 200) {
            this.$store.commit('user/SET_NAME', this.userName)
            done()
          }
        } else {
          Notify({
            type: 'warning',
            message: '请输入正确的名称可以是字母数字或汉字组合'
          })
          done(false)
        }
      } else {
        done()
      }
    },
    // 显示选中出生日期组件
    showDateTimePicker () {
      this.currentDate = new Date(this.userEditorInfo.birthday)
      this.showPopup = true
    },
    // 更新出生日期
    async UpdateBirthday () {
      const NewBirthday = formatDate(this.currentDate)
      const result = await this.$Api.user.SetUserInfo({ birthday: NewBirthday })
      if (result.status === 200) {
        this.userEditorInfo.birthday = NewBirthday
        this.showPopup = false
      }
    }
  },
  computed: {
    // 获取头像信息这样用共同的数据可以实现数据共享
    ...mapState('user', ['photo', 'name'])
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
