import { Component, Vue } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { VueParticles } from '../../components/vue-particles'
import { AtomSpinner } from 'epic-spinners'
import { FaceCheck } from '../../components/FaceCheck'
import { getUserInfo,login,logout,getHallList } from '../../api/user'
import { intoRoom, } from '../../api/case'
import { SelectDialog } from '../../components/SelectDialog'
// import { clerkSelectDialog } from '../../components/clerkSelectDialog'
import md5 from 'md5'
import RWS from '../../utils/rws'

import './loginPage.less'


interface LoginFormShape {
  username: string
  password: string
  code: string
}



interface SearchForm {
  caseNo: string,
  pageNumber: number,
  
}

interface CaseListShape {
  [index: number]: CaseObjectShape
}



interface PageData {
  pageNumber: number,
  total: number,
  size: number,
}

interface roleListShape {
  [index: number]: roleObjectShape
}

interface role {
  roleType: number,
}


interface roleObjectShape {
  id: number,
  type: number,
  name: string
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
    VueParticles,
    AtomSpinner,
    FaceCheck,
    SelectDialog,
    // clerkSelectDialog
  }
})

export class LoginPage extends Vue {
    @Getter('getLoginState') hasLogin: boolean
    @Getter('getFaceCheckState') hasFaceCheck: boolean
    @Getter('getCaseList') caseList: CaseListShape
    @Getter('getSelectedCase') selectedCase: Array<any>
    // @Getter('getclerkBatcnRooms') clerkBatcnRooms: Array<any>
    @Getter('getSelectAllCase') endCheck: boolean
    @Action('phoneLogin') phoneLogin: Function
    @Action('optionRole') optionRole: Function
    @Action('getCode') getCodeApi: Function
    @Action('logout') logout: Function
    @Action('searchCaseList') searchCaseList: Function
    @Action('getRoomToken') getRoomToken: Function
    @Action('setCaseNo') setCaseNo: Function
    @Getter('getWebsocket') websocket: RWS
    @Action('setWebsocket') setWebsocket: Function
    @Action('setSelectList') setSelectList: Function
    @Action('setSelectAllRes') setSelectAllRes: Function
    // @Action('setclerkRooms') setclerkRooms: Function

    // @Action('login') login:Function
    // @Action('getHallList') getHallList:function
    // @Action('logout') logout:Function
    

    totalPage: number = 9
    loading: boolean = false
    isSel: boolean = false
    nowSelTab:string = ''
    selected: boolean = false
    batchRoomsShow: boolean = false
    loginrole:string = ''
    rList: Array<any> = []
    // 用户类型 judge or litigant
    userType: string = 'judge'
    // 验证码
    codeSrc: string = '/api/main/code.jhtml'
    // 用户表单参数
    judgeLoginForm: LoginFormShape = {
        username: '',
        password: '',
        code: '',
    }
  caseList2: Array<any> =  []
  
  
  show: boolean = true
  count: number = 60
  timer: null | any = null
  isLogin: boolean = false
  pageData: PageData = {
    pageNumber: 1,
    total: 0,
    size:7
  }
  searchForm: SearchForm = {
    caseNo: '',
    pageNumber: this.pageData.pageNumber
  }
  hallName:string = ''
  nowPage:Number = 1
  statusType:Array<any> = [
    '未申请','已受理','已分发','已分配','调解中','待调解(弃用)','生成调解协议(待签字)','调解成功(已签字)','不受理'
  ]
  mounted () {
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.7)'
    });
    this.changeCode();
    getUserInfo().then(res => {
      console.log(res.data);
      if(res.data.state == 100){
        this.isLogin = true;
        getHallList(this.hallName,this.nowPage,6).then(res => {
          loading.close();
          if(res.data.state == 100){
            this.totalPage = res.data.totalPages;
            this.caseList2 = res.data.content;
          }
        })
      }else{
        loading.close();
        this.isLogin = false;
      }
    })
  }

  changeCode () {
    this.codeSrc = '/api/main/code.jhtml?tm=' + Math.random();
  }

  handleLogin () {
    this.loading = true
    login(this.judgeLoginForm.username,md5(this.judgeLoginForm.password),this.judgeLoginForm.code).then(res => {
      this.loading = false;
      if (res.data.state === 100) {
        this.$swal({
          type: 'success',
          title: res.data.message
        })
        this.loading = true;
        this.isLogin = true;
        getHallList(this.hallName,this.nowPage,6).then(res => {
          this.loading = false;
          console.log(res.data);
          this.totalPage = res.data.totalPages;
          this.caseList2 = res.data.content;
        })
      }else {
        this.$swal({
          type: 'error',
          title: res.data.message
        })
      }
    })
    .catch(error => {
      this.$swal({
        type: 'error',
        title: '网络错误！'
      })
    })
  }

  backToLogin () {
    logout().then(res => {
      if(res.data.state == 100){
        this.isLogin = false;
        this.changeCode();
        this.$swal({
          type: 'success',
          title: res.data.message
        })
      }else{
        this.$swal({
          type: 'error',
          title: res.data.message
        })
      }
    })
    .catch(error => {
      this.$swal({
        type: 'error',
        title: '网络错误'
      })
    })
  }

  serachByCaseNo(){
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.7)'
    });
    getHallList(this.hallName,this.nowPage,6).then(res => {
      loading.close();
      this.totalPage = res.data.totalPages;
      this.caseList2 = res.data.content;
    })
  }

  roomToken (obj) {
    // 记录选择的caseNo
    this.setCaseNo(obj.id)
    window.localStorage.setItem('roomId',obj.id);
    window.localStorage.setItem('hallName',obj.name);
    let parmas={
        caseid:obj.id,
        roomType:1
    }
    // intoRoom(obj.id).then(res => {
    //   console.log(res.data);
    //   this.setWebsocket()
    //   store.commit(types.SET_ROOM_TOKEN, res.data.result)
    //   store.commit(types.SET_CASE_ID, obj.id)
    //   this.$router.push({
    //     name: 'roomPage'
    //   })
    // })
    this.loading = true
    // 查询房间token
    this.getRoomToken(parmas).then(res => {
      this.loading = false
      if (res.data.state === 100) {
        this.setWebsocket()
        // this.websocket.refresh()
        console.log(this.loginrole)
        this.$router.push({
          name: 'roomPage',
          params:{isOpen:res.data.is_open}
        })
        
      } else {
        console.log(obj.noTips)
        if(!obj.noTips){

        }else{
          console.log(11111111111)
          this.$alert(res.data.message, '', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
        
        // this.$swal({
        //   type: 'error',
        //   title: res.data.message
        // })
      }
    })
  }

  getRecord(id){
    window.localStorage.setItem('hallId',id);
    this.$router.push({
      name: 'recordRoom',
    })
  }

  pageChange(pageNum){
    this.nowPage = pageNum;
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.7)'
    });
    getHallList(this.hallName,this.nowPage,6).then(res => {
      loading.close();
      this.totalPage = res.data.totalPages;
      this.caseList2 = res.data.content;
    })
  }

}
