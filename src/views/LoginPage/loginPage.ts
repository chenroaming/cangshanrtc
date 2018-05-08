import { Component, Vue } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { VueParticles } from '../../components/vue-particles'

import './loginPage.less'

interface LoginFormShape {
  username: string
  password?: string
  code: string
}

interface SearchForm {
  caseNo: string
}

interface CaseListShape {
  [index: number]: CaseObjectShape
}

interface CaseObjectShape {
  id: number,
  caseNo: string,
  isOpen: number
}

const TIME_COUNT: number = 60

@Component({
  template: require('./loginPage.html'),
  components: {
    VueParticles
  }
})

export class LoginPage extends Vue {
  @Getter('getLoginState') hasLogin: boolean
  @Getter('getCaseList') caseList: CaseListShape
  @Action('login') login: Function
  @Action('phoneLogin') phoneLogin: Function
  @Action('getCode') getCodeApi: Function
  @Action('logout') logout: Function
  @Action('searchCaseList') searchCaseList: Function
  @Action('getRoomToken') getRoomToken: Function

  // 用户类型 judge or litigant
  userType: string = 'judge'
  // 验证码
  codeSrc: string = '/api/main/code.jhtml'
  // 用户表单参数
  judgeLoginForm: LoginFormShape = {
    username: '',
    password: '',
    code: ''
  }

  litigantLoginForm: LoginFormShape = {
    username: '',
    code: ''
  }

  show: boolean = true
  count: number = 60
  timer: null | any = null

  searchForm: SearchForm = {
    caseNo: ''
  }

  changeCode () {
    this.codeSrc = '/api/main/code.jhtml?tm=' + Math.random()
  }

  handleLogin () {
    switch (this.userType) {
      case 'judge':
        this.login(this.judgeLoginForm).then(res => {
          if (res.data.state === 100) {
            // this.$router.push({
            //   name: 'roomPage'
            // })
          }
        })
        break
      case 'litigant':
        this.phoneLogin(this.litigantLoginForm)
        break
    }
  }

  getCode () {
    if (!this.timer) {
      this.getCodeApi(this.litigantLoginForm.username)
      this.count = TIME_COUNT
      this.show = false
      this.timer = setInterval(() => {
        if (this.count > 0 && this.count <= TIME_COUNT) {
          this.count--
        } else {
          this.show = true
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    }
  }

  backToLogin () {
    this.logout()
  }

  serachByCaseNo () {
    this.searchCaseList(this.searchForm.caseNo)
  }

  roomToken (id) {
    this.getRoomToken(id).then(res => {
      console.log(res)
      if (res.data.state === 100) {
        this.$router.push({
          name: 'roomPage'
        })
      }
    })
  }
}
