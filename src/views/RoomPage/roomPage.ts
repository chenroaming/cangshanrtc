import { Component, Vue,Watch } from 'vue-property-decorator'
import { Getter, Action, Mutation } from 'vuex-class'
import { MainPlayer } from '../../components/MainPlayer'
import { LocalPlayer } from '../../components/LocalPlayer'
import { RemotePlayer } from '../../components/RemotePlayer'
// import { ChatWindow } from '../../components/ChatWindow'
// import { EvidenceWindow } from '../../components/EvidenceWindow'
// import { WorkerWindow } from '../../components/WorkerWindow'
// import { logWindow } from '../../components/logWindow'
// import { CourtWindow } from '../../components/CourtWindow'
import { piliRTC } from '../../utils/pili'
import { deviceManager } from 'pili-rtc-web'
import { exportLog } from '../../api/export'
import { getUserInfo } from '../../api/user'
import { finish,createImg,startMediate,closeRoom,intoRoom,changePar1,changePar,changePar2,getFileName,getRecordId } from '../../api/case'
import { getEviNote } from '../../api/evidence'
import RWS from '../../utils/rws'
import swal from 'sweetalert2'

import './roomPage.less'
import { ElStep } from 'element-ui/types/step'

interface UserInfoShape {
  id: number,
  name: string,
  role: string,
}

@Component({
    template: require('./roomPage.html'),
    components: {
        MainPlayer,
        LocalPlayer,
        RemotePlayer,
        // ChatWindow,
        // EvidenceWindow,
        // WorkerWindow,
        // logWindow,
        // CourtWindow
    }
})

export class RoomPage extends Vue {
  @Getter('getRoomToken') roomToken: string
  @Mutation('SET_USERID') setUserId: Function
  @Getter('getUserId') userId: string
  @Getter('getMessage') logMessage: Array<any>
  // @Getter('getCaseNo') caseNo: string
  @Getter('getCaseId') caseId: number
  @Getter('getMainInfo') mainInfo: any
  @Getter('getUserInfo') userInfo: UserInfoShape
  @Action('cleanMessage') cleanMsg: Function
  @Getter('getWebsocket') websocket: RWS
  @Action('websocketSend') send: Function
  @Action('setVideoSrcObj') setVideoSrcObj: Function
  @Getter('getSelectedCase') selectedCase: Array<any>


  dialogShow: boolean =false
  isActive:any = '1'
  users: Array<any> = []
  evidenceShow: boolean = false
  workerShow: boolean = false
  courtShow: boolean = false
  targetShow: string = ''
  logShow: boolean = false
  message: string = ''
  windowIsShowClass: string = ''
  week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  clock = {
    date: '',
    time: '',
    week: ''
  }
  timer: any
  stream: any = {}
  isReadWindow: boolean = true
  totalTime: number = 7
  canClick: boolean = true
  isCheck: boolean =true
  content: string = '明白'
  show1: boolean = true
  windowIsshow: boolean = true
  dialogFormVisible: boolean = false
  joinPeople:boolean = false
  formLabelWidth: string = '120px'
  joinPeopleArr:Array<any> = [
    {type:'申请人',name:'zhangsan',id:'111'},
    {type:'被申请人',name:'wangwu',id:'222'},
  ]
  form: any = {
    name:'safdas',
    id_card: '111',
    address: 'xxx0',
    phone: '111',
    type: '2'
  }
  applicant: any = {
    name:'',
    id_card: '',
    address: '',
    phone: '',
    type: '2'
  }
  respondent:any = {
    name:'',
    id_card: '',
    address: '',
    phone: '',
    type: '3'
  }
  roomId:string = ''
  hallName:string = ''
  loading1:boolean = false
  baseInfoShow:boolean = true
  justiceBureau:string = ''
  mediationTime:string = ''
  caseNo:string = ''
  roleName:string = ''
  pant1:string = ''
  pant2:string = ''
  recordId:string = ''
  justiceId:string = ''
  @Watch('mainInfo')
  onChildChanged(val: any, oldVal: any) {
      console.log(val)
      console.log(oldVal)
      if (val.roleName!='法官') {
        this.windowIsShowClass='show'
      }else{
        this.windowIsShowClass=''
      }
      console.log(this.users)
  }
created () {
    // 情况语音列表
    
    this.hallName = window.localStorage.getItem('hallName')
    this.roomId = window.localStorage.getItem('roomId')
    this.cleanMsg()
    // this.content = this.totalTime + 's后可关闭'
    // let clock = window.setInterval(() => {
    //     this.totalTime--
    //     this.content = this.totalTime + 's后可关闭'
    //     if (this.totalTime < 0) {
    //     window.clearInterval(clock)
    //     this.content = '明白'
    // }
    // },1000)
    // this.timer = setInterval(() => {
    //   this.updateTime()
    // }, 1000)

    piliRTC.on('user-join', user => {
      console.log('user-join')
      console.log(this.users)
      console.log(this.userInfo)
      this.users.map((item, index) => {
        if (!item.published) this.users.splice(index, 1)
      })
    })
    piliRTC.on('user-publish', user => {
      console.log('user-publish')
      this.users.push(user)
    })
    piliRTC.on('user-unpublish', user => {
      console.log('user-unpublish')
      this.users.map((item, index) => {
        if (item.userId === user.userId) this.users.splice(index, 1)
      })
    })
  }
  async mounted () {
    // 进入房间
    getUserInfo().then(res => {
      this.roleName = res.data.roleName;
    })
    try {
      console.log('joinRoomWithToken')
      const roomInfo = await piliRTC.joinRoomWithToken(this.roomToken)
      console.log(roomInfo)
    } catch (e) {
      console.log('加入房间失败!', e)
    }
    try {
      const localStream = await deviceManager.getLocalStream({
        audio: {
          enabled: true
        },
        video: {
          enabled: true,
          bitrate: 720,
          frameRate: 30,
          width: 1280,
          height: 720
        }
      })
      console.log('roompage getLocalStream')
      localStream.play((this.$refs.localPlayer as any).$el, true)
      // 本地推流
      try {
        console.log('publish')
        const publishInfo = await piliRTC.publish(localStream)
        this.setUserId(publishInfo.userId)
        this.setVideoSrcObj(localStream.mediaStream)
      } catch (e) {
        console.log('本地推流失败!', e)
      }
    } catch (e) {
      switch (e.name) {
        case 'NotAllowedError':
          console.log('获取摄像头权限被拒绝，请手动打开摄像头权限后重新进入页面')
          break
        case 'TypeError':
          break
        default:
          console.log(`无法获取摄像头数据，错误代码${e.name}`)
      }
    }
    this.users = piliRTC.users
    this.users.map((item, index) => {
      if (!item.published) this.users.splice(index, 1)
    })
  }

  destroyed () {
    piliRTC.leaveRoom()
    // clearInterval(this.timer)
    // this.websocket.close()
    piliRTC.removeAllListeners('user-join')
    piliRTC.removeAllListeners('user-publish')
    piliRTC.removeAllListeners('user-unpublish')
  }

  async endCourt () {
    this.$swal({
      title: '确认结束庭审',
      text: '结束庭审后案件将进入结案状态，无法再次开庭',
      type: 'warning',
      showCancelButton: true,
      cancelButtonText: '取消',
      cancelButtonColor: '#d33',
      confirmButtonText: '结束'
    }).then(res => {
      if (res.value) {
        finish().then(res => {
          if (res.data.state === 100) {
            this.$router.push({
              name: 'loginPage'
            })
          } else {
            this.swal({
              type: 'error',
              title: res.data.message
            })
          }
        })
      }
    })
  }

  sendInfo(){
    this.dialogFormVisible = false;
  }

  async outRoom () {
    // exportLog(this.caseId).then(res => {
    //   console.log(res)
    // })
    closeRoom(this.roomId).then(res => {
      console.log(res)
    })
    this.$router.push({
      name: 'loginPage'
    })
  }
  exportlog () {
    exportLog(this.caseId).then(res => {
      if (res.data.state === 100) {
        let eleLink = document.createElement('a')
        let arr = res.data.result.split('/')
        eleLink.download = arr[arr.length - 1]
        eleLink.style.display = 'none'
        eleLink.href = location.origin + res.data.result
        // 触发点击
        document.body.appendChild(eleLink)
        eleLink.click()
        // 然后移除
        // document.body.removeChild(eleLink)
      } else {
        this.$swal({
          type: 'error',
          title: res.data.message
        })
      }
    })
  }
  choice(id){
    this.isActive = id;
    if(this.isActive == '1'){
      if(!this.recordId && this.roleName == '法院'){
        this.$swal({
          type:"error",
          title:"请先补全申请人/被申请人/司法局信息！"
        })
        return;
      }
      const hallId = window.localStorage.getItem('roomId');
      getRecordId(hallId).then(res => {
        if(res.data.state == 100){
          this.recordId = res.data.recordId;
          getFileName(this.recordId).then(res => {
            console.log(res.data);
            const fileName = '';
            if(res.data.have){
              fileName = res.data.fileUrl;
            }else{
              fileName = res.data.fileUrl + 'new';
            }
            
            if(this.roleName == '法院'){
              window.location.href = 'WebOffice://|Officectrl|http://mediate.ptnetwork001.com/tartctest/edit.html?file='+fileName;
            }else{
              window.location.href = 'WebOffice://|Officectrl|http://mediate.ptnetwork001.com/tartctest/edit2.html?file='+fileName;
            }
            this.baseInfoShow = false;
          })
        }
      })
      return;
    }
    if(this.isActive == '2'){
      this.baseInfoShow = !this.baseInfoShow;
    }
  }
  getQRimg(){
      this.$swal({
        title: '扫描二维码签名确认',
            html: "<div>申请人：<img  src='../../assets/img/applicant.png' style='width:55%'></div><div>被申请人：<img  src='../../assets/img/applicant.png' style='width:55%'></div>",
        confirmButtonText: '好的',
        allowOutsideClick: false,
      })
    // createImg().then(res => {
    //     this.$swal({
    //     title: '扫描二维码签名确认',
    //         html: "<img  src="+'/'+QRCode+" style='width:55%'>",
    //     confirmButtonText: '好的',
    //     allowOutsideClick: false,
    //   })
    // })
    
  }
  start(){
    const hallId = window.localStorage.getItem('hallId');
    startMediate(hallId,this.pant1,this.pant2,this.justiceId).then(res => {
      if(res.data.state == 100){
        this.$swal({
          type:'success',
          title:res.data.message
        })
      }
    })
  }
  getById(id = ''){
    this.joinPeople = true;
    console.log(id);
  }
  del(id = ''){
    this.$confirm('确认删除该参与人?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      });          
    });
  }
  submit(){
    this.loading1 = true;
    // if(!this.applicant.name || !this.respondent.name){
    //   this.$swal({
    //     type:'error',
    //     title: '申请人和被申请人姓名不能为空！'
    //   })
    //   this.loading1 = false;
    //   return;
    // }
    changePar1('','2',this.caseNo,this.applicant.name,this.applicant.phone,this.applicant.id_card,this.applicant.address).then(res => {
      
      if(res.data.state == 100){
        this.pant1 = res.data.pantId;
        this.recordId = res.data.recordId;
        changePar('','3',this.respondent.name,this.respondent.phone,this.respondent.id_card,this.respondent.address).then(res => {
          if(res.data.state == 100){
            this.pant2 = res.data.pantId;
            changePar2('','1',this.justiceBureau).then(res => {
              this.loading1 = false;
              if(res.data.state == 100){
                this.justiceId = res.data.pantId;
                this.$swal({
                  type:'success',
                  title: res.data.message
                })
                return;
              }
              if(res.data.state == 101){
                this.$swal({
                  type:'error',
                  title: res.data.message
                })
              }
            })
            this.baseInfoShow = false;
            
            return;
          }
          if(res.data.state == 101){
            this.$swal({
              type:'error',
              title: res.data.message
            })
          }
        })
        return;
      }
      if(res.data.state == 101){
        this.$swal({
          type:'error',
          title: res.data.message
      })
    })
  }
  opens(){
    this.dialogShow = true;
  }
  clearAll(){
    this.dialogShow = false;
  }
  handleClose(){
    this.dialogShow = false;
  }
  getNote(tem){
    console.log(tem)
    getEviNote(tem.caseId).then(res=> {
      this.dialogShow = false;
      if (res.data.state === 100) {
        let src = res.data.result.path
        swal({
          html: `<iframe src="${src}" width="750" height="450" frameborder="0" style="object-fit: fill;"></iframe>`,
          width: '850px',
          confirmButtonText: '关闭'
        })
      } else {
        swal({
          title: '提示',
          text: res.data.message,
          type: 'warning',
          confirmButtonText: '关闭'
        })
      }
    })
  }
  // updateTime () {
  //   let cd = new Date()
  //   this.clock.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2)
  //   this.clock.date = this.zeroPadding(cd.getFullYear(), 4) + '年' + this.zeroPadding(cd.getMonth() + 1, 2) + '月' + this.zeroPadding(cd.getDate(), 2) + '日'
  //   this.clock.week = this.week[cd.getDay()]
  // }
  zeroPadding (num, digit) {
    let zero = ''
    for (let i = 0; i < digit; i++) {
      zero += '0'
    }
    return (zero + num).slice(-digit)
  }

  jumpBigData () {
    window.open('/bigData/index.html')
  }
  signCheck(){
      let that = this;
    //   console.log()
      //掉接口获取二维码路径
      createImg().then(res => {
        if (res.data.state === 100) {
          console.log(res)
          let QRCode=res.data.path
          this.$swal({
            title: '扫描二维码签名确认',
                html: "<img  src="+'/'+QRCode+" style='width:55%'>",
            // imageUrl: '/dist/images/tu-s.png',
            confirmButtonText: '好的',
            allowOutsideClick: false,
        })
        // 通知服务端（证据同步投屏）
        console.log(that.userInfo.role)
        if(that.userInfo.role == '法官'){
          let sendObj = { 'name': '', 'roleName': '', 'type': 9, 'wav': '', 'content':'/' + QRCode, 'createDate': '' }
          let sendJSON = JSON.stringify(sendObj)
          that.send(sendJSON)
          console.log('发送成')
        }
        
        } else {
          this.$swal({
            type: 'error',
            title: res.data.message
          })
        }
      })
  }
  closeIsRead(){
      if (this.content=='明白') {
          if (this.isCheck) {
            this.isReadWindow=false
          }
        
      }
      
  }
  CheckItem(e){
      console.log(e.target.checked)
      this.isCheck=e.target.checked
  }
}
