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
import { finish,createImg2,startMediate,endMediate,closeRoom,intoRoom,changePar,getFileName,getRecordId,getByRoomId,getMaxNo,getProofByRecordId,getProofImg,getProof,getProtocolParam,saveProParam,getProtocolParam2 } from '../../api/case'
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
  @Action('setMainInfo') setMainInfo: Function
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
  dialogFormVisible2: boolean = false
  joinPeople:boolean = false
  formLabelWidth: string = '186px'
  joinPeopleArr:Array<any> = [
    {type:'申请人',name:'zhangsan',id:'111'},
    {type:'被申请人',name:'wangwu',id:'222'},
  ]
  form: any = {
    name:'safdas',
    idCard: '111',
    address: 'xxx0',
    phone: '111',
    type: '2'
  }
  applicant: any = {
    name:'',
    idCard: '',
    address: '',
    phone: '',
    type: '2',
    pantId:''
  }
  respondent:any = {
    name:'',
    idCard: '',
    address: '',
    phone: '',
    type: '3',
    pantId:''
  }
  roomId:string = ''
  hallName:string = ''
  loading1:boolean = false
  baseInfoShow:boolean = false
  justiceBureau:any = {
    type:'1',
    name:'',
    pantId:''
  }
  mediationTime:string = ''
  caseNo:string = ''
  roleName:string = ''
  pant1:string = ''
  pant2:string = ''
  recordId:string = ''
  justiceId:string = ''
  dialogVisible:boolean = false
  protocolUrl:string = ''
  eviShow:boolean = false
  eviList:Array<any> = []
  eviQrcode:string = ''
  picShow:boolean = false
  eviListpic:Array<any> = []
  eviTitle:string = ''
  isOpen:boolean = false
  deg:number = 0
  roomId2:string = ''
  protocolId:string = ''
  protocol:any = {
    content:'',
    fact:'',
    typeAndTime:'',
    count:''
  }
  protocolLoading:boolean = false
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
      this.isOpen = this.$route.params.isOpen ? true : false;
      this.roleName = res.data.roleName;
      this.setMainInfo({ name: res.data.result.username, roleName: this.roleName })
      this.initWebsocketEvent();//webSocket初始化
      // if(this.roleName != '法院'){
      //   this.baseInfoShow = false;
      //   return;
      // }
      if(this.isOpen){
        getMaxNo().then(res => {
          if(res.data.state == 100){
            this.caseNo = res.data.mediateNo;
          }
        })
      }
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
    this.websocket.close()
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
  initWebsocketEvent () {
    console.log(this.websocket);
    this.websocket.onclose = () => {
      console.log('websocket断开')
    }
    this.websocket.onerror = () => {
      console.log('websocket错误')
    }
    this.websocket.onopen = () => {
      console.log('websocket链接')
      // const obj = {
      //   name:'zhangsan'
      // }
      // this.send(JSON.stringify(obj))
    }
    this.websocket.onmessage = (event) => {
      console.log(event.data)
      let result = JSON.parse(event.data)
      this.eviListpic = [];
      for (const item of result.urls){
        const obj = {
          src:'https://cstj.olcourt.cn' + item,
        }
        this.eviListpic.push(obj);
      }
      this.picShow = true;
      this.eviTitle = result.proofName;
      const hallId = window.localStorage.getItem('roomId');
      getRecordId(hallId).then(res => {
        if(res.data.state == 100){
          this.recordId = res.data.recordId;
          this.eviList = [];
          getProofByRecordId(this.recordId).then(res => {
            if(res.data.state == 100){
              for (let i = 0;i < res.data.proofs.length;i++){
                const obj = {
                  No:'证据' + (i + 1),
                  name:res.data.proofs[i].name,
                  id:res.data.proofs[i].id,
                  proofUrlSet:res.data.proofs[i].proofUrlSet
                }
                this.eviList.push(obj);
              }
            }
          })
          getProofImg(this.recordId).then(res => {
            if(res.data.state == 100){
              this.eviQrcode = 'https://cstj.olcourt.cn/' + res.data.path;
            }
          })
        }else if(res.data.state == 101){
          this.$swal({
            type:"error",
            title:res.data.message
          })
        }
      })
    }
  }
  sendInfo(){
    this.dialogFormVisible = false;
  }

  async outRoom () {
    // exportLog(this.caseId).then(res => {
    //   console.log(res)
    // })
    if(this.isOpen){
      closeRoom(this.roomId).then(res => {
        console.log(res)
      })
    }
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
  getPantId(){
    getByRoomId().then(res => {
      if(res.data.state == 100){
        for (const item of res.data.pants1){
          if(item.type == '1'){
            this.justiceBureau.name = item.name ? item.name : '';
            this.justiceBureau.pantId = item.id ? item.id :'';
          }else if(item.type == '2'){
            this.applicant.name = item.name ? item.name : '';
            this.applicant.idCard = item.idCard ? item.idCard : '';
            this.applicant.phone = item.phone ? item.phone : '';
            this.applicant.pantId = item.id ? item.id : '';
            this.applicant.address = item.address ? item.address : '';
          }else if(item.type == '3'){
            this.respondent.name = item.name ? item.name : '';
            this.respondent.idCard = item.idCard ? item.idCard : '';
            this.respondent.phone = item.phone ? item.phone : '';
            this.respondent.pantId = item.id ? item.id : '';
            this.respondent.address = item.address ? item.address : '';
          }
        }
        this.caseNo = res.data.mediateNo;
      }
    })
  }
  choice(id){
    this.isActive = id;
    if(this.isActive == '1'){
      if(!this.recordId && this.isOpen){
        this.$swal({
          type:"error",
          title:"请先补全申请人/被申请人/司法局信息！"
        })
        return;
      }
      getFileName().then(res => {
        console.log(res.data);
        let fileName = '';
        if(res.data.state != 100){
          this.$swal({
            type:"error",
            title:res.data.message
          })
          return;
        }
        if(res.data.have){
          fileName = res.data.fileUrl;
        }else{
          fileName = res.data.fileUrl + 'new';
        }
        if(!res.data.have && !this.isOpen){
          this.$swal({
            type:"error",
            title:"暂无协议材料！"
          })
          return;
        }
        if(this.isOpen){
          // window.location.href = 'WebOffice://|Officectrl|http://cstj.olcourt.cn/tartctest/edit.html?file='+fileName;//法院
          // window.open('https://cstj.olcourt.cn/uedit/index.html?roomId=' + res.data.roomId,'_blank');
          if(this.protocolId){
            getProtocolParam(this.protocolId).then(res => {
              this.protocol.content = res.data.data.content;
              this.protocol.fact = res.data.data.fact;
              this.protocol.typeAndTime = res.data.data.typeAndTime;
              // this.protocol.count = res.data.data.count;
            })
          }else{
            getProtocolParam2().then(res => {
              console.log(res.data);
            })
          }
          this.roomId2 = res.data.roomId;
          this.dialogFormVisible2 = true;
        }else{
          // window.open('http://view.officeapps.live.com/op/view.aspx?src=http://cstj.olcourt.cn'+res.data.fileUrl);//议理堂司法局
          // window.location.href = 'WebOffice://|Officectrl|http://cstj.olcourt.cn/tartctest/edit2.html?file='+res.data.fileUrl;//议理堂司法局
          this.dialogVisible = true;
          this.protocolUrl = 'https://view.officeapps.live.com/op/view.aspx?src=https://cstj.olcourt.cn' + res.data.fileUrl + '?random=' + Math.random();
        }
        this.baseInfoShow = false;
      })
      // const hallId = window.localStorage.getItem('roomId');
      // getRecordId(hallId).then(res => {
      //   if(res.data.state == 100){
      //     this.recordId = res.data.recordId;
          
      //   }
      // })
      return;
    }
    if(this.isActive == '2'){
      if(this.recordId){
        this.getPantId();
      }else if(!this.isOpen){
        this.getPantId();
      }
      this.baseInfoShow = !this.baseInfoShow;
      this.eviShow = false;
      return;
    }
    if(this.isActive == '3'){
        const hallId = window.localStorage.getItem('roomId');
        // const hallId = '2f61df55c18b5q7werqkpov41415';
        if(!this.eviShow){
          getRecordId(hallId).then(res => {
            if(res.data.state == 100){
              this.eviShow = !this.eviShow;
              this.baseInfoShow = false;
              this.recordId = res.data.recordId;
              this.eviList = [];
              getProofByRecordId(this.recordId).then(res => {
                if(res.data.state == 100){
                  for (let i = 0;i < res.data.proofs.length;i++){
                    const obj = {
                      No:'证据' + (i + 1),
                      name:res.data.proofs[i].name,
                      id:res.data.proofs[i].id,
                      proofUrlSet:res.data.proofs[i].proofUrlSet
                    }
                    this.eviList.push(obj);
                  }
                }
              })
              getProofImg(this.recordId).then(res => {
                if(res.data.state == 100){
                  this.eviQrcode = 'https://cstj.olcourt.cn/' + res.data.path;
                }
              })
            }else if(res.data.state == 101){
              this.$swal({
                type:"error",
                title:res.data.message
              })
            }
          })
        }else{
          this.eviShow = !this.eviShow;
        }
    }
  }
  getQRimg(){
      const hallId = window.localStorage.getItem('roomId');
      getRecordId(hallId).then(res => {
        if(res.data.state == 100){
          this.recordId = res.data.recordId;
          createImg2(this.recordId).then(res => {
            if(res.data.state == 100){
              this.$swal({
                title: '扫描二维码签名确认',
                html: "<div><img  src='https://cstj.olcourt.cn/"+res.data.path+"' style='width:55%'></div>",
                confirmButtonText: '好的',
                allowOutsideClick: false,
              })
              // if(this.roleName == '法院' || this.roleName ==  '司法局'){
              //   this.$swal({
              //     title: '扫描二维码签名确认',
              //     html: "<div><img  src='https://cstj.olcourt.cn/"+res.data.pathList[0]+"' style='width:55%'></div>",
              //     confirmButtonText: '好的',
              //     allowOutsideClick: false,
              //   })
              //   return;
              // }
              // this.$swal({
              //   title: '扫描二维码签名确认',
              //   html: "<div><p>申请人请扫描以下二维码</p><img  src='https://cstj.olcourt.cn/"+res.data.pathList[0]+"' style='width:55%'></div><div><p>被申请人请扫描以下二维码</p><img  src='https://cstj.olcourt.cn/"+res.data.pathList[1]+"' style='width:55%'></div>",
              //   confirmButtonText: '好的',
              //   allowOutsideClick: false,
              // }) 
            }else if(res.data.state == 101){
              this.$swal({
                type:'error',
                title:res.data.message
              })
            }
          })
        }else if(res.data.state == 101){
          this.$swal({
            type:'error',
            title:res.data.message
          })
        }
      })
      return;
  }
  watchEvi(index,No){
    console.log(this.eviList[index]);
    this.eviListpic = [];
    const picArr = this.eviList[index];
    if(this.roleName == '法院' || this.roleName ==  '司法局'){
      getProof(this.eviList[index].id).then(res => {

      })
    }
    for (const item of picArr.proofUrlSet){
      const obj = {
        src:'https://cstj.olcourt.cn' + item.path,
      }
      this.eviListpic.push(obj);
    }
    this.picShow = true;
    this.eviTitle = No;
  }
  start(command){
    if(command == 'start'){
      const hallId = window.localStorage.getItem('hallId');
      startMediate().then(res => {
        if(res.data.state == 100){
          this.$swal({
            type:'success',
            title:res.data.message
          })
        }else if(res.data.state == 101){
          this.$swal({
            type:'error',
            title:res.data.message
          })
        }
      })
    }else{
      endMediate().then(res => {
        if(res.data.state == 100){
          this.$swal({
            type:'success',
            title:res.data.message
          })
        }else if(res.data.state == 101){
          this.$swal({
            type:'error',
            title:res.data.message
          })
        }
      })
    }
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
    const pant = {
      mediateNo:this.caseNo,
      pantList:[]
    };
    pant.pantList.push(this.applicant);
    pant.pantList.push(this.respondent);
    pant.pantList.push(this.justiceBureau);
    changePar(pant).then(res => {
      this.loading1 = false;
      this.baseInfoShow = false;
      this.getPantId();
      if(res.data.state == 100){
        this.$swal({
          type:"success",
          title:res.data.message
        })
        this.recordId = res.data.recordId;
      }else if(res.data.state == 101){
        this.$swal({
          type:"error",
          title:res.data.message
        })
      }
    })
  }
  rotate(){//图片旋转
    this.deg += 90;
    if(this.deg >= 360){
        this.deg = 0
    }
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
  
  CheckItem(e){
      console.log(e.target.checked)
      this.isCheck=e.target.checked
  }

  submitProtocol(){
    // const data = {
    //   content:this.protocol.content,
    //   fact:this.protocol.fact,
    //   typeAndTime:this.protocol.typeAndTime,
    //   count:this.protocol.count
    // }
    this.protocolLoading = true;
    saveProParam(this.protocol.content,this.protocol.fact,this.protocol.typeAndTime).then(res => {
      this.protocolLoading = false;
      if(res.data.state == 100){
        this.dialogFormVisible2 = false;
        this.protocolId = res.data.protocolId;
        window.open('https://cstj.olcourt.cn/uedit/index.html?roomId=' + this.roomId2,'_blank');
      }else if(res.data.state == 101){
        this.$swal({
          type:"error",
          title:res.data.message
        })
      }
    })
    // window.open('https://cstj.olcourt.cn/uedit/index.html?roomId=' + res.data.roomId,'_blank');
  }
}
