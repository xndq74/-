<template>
  <div>
    <van-nav-bar title="标题" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        label="手机号"
        required
        placeholder="请输入手机号"
        autocomplete= "off"
        :rules="[{ required: true, message: '请输入正确的手机号', pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/ }]"
      />
      <van-field
        v-model="user.code"
        type="password"
        name="code"
        label="密码"
        required
        placeholder="密码"
        :rules="[{ required: true, message: '请填写正确的密码', pattern: /^\d{6}$/ }]"
      />
      <!-- loading 是为true就是在加载中。 -->
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit" :loading='isButtonLoading' :disabled='isButtonLoading' loading-text="登入中..."
          >登入</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { Notify } from 'vant'
export default {

  name: 'Login',
  data () {
    return {
      user: {
        mobile: '13888888888',
        code: '246810'
      },
      isButtonLoading: false
    }
  },
  mounted () {

  },
  methods: {
    // 提交事件
    async onSubmit (values) {
      this.isButtonLoading = true
      await this.$store.dispatch('user/GetLoginData', values)
      this.isButtonLoading = false
      Notify({ type: 'success', message: '登入成功', duration: 1000 })
    }
  }
}
</script>

<style lang="scss" scoped></style>
