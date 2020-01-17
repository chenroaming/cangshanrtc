import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Getter, Action, Mutation } from 'vuex-class'
// import { userDetail } from '../../api/user'
import {getUserInfo} from '../../api/user'
import './localPlayer.less'

interface UserInfoShape {
  id: number,
  name: string,
  role: string
}
interface UserInfoShapeMain {
    name: string,
    roleName: string
  }

@Component({
  template: require('./localPlayer.html')
})
export class LocalPlayer extends Vue {
  @Getter('getUserInfo') userInfo: UserInfoShape
  @Getter('getMainInfo') mainInfo: UserInfoShapeMain
  @Mutation('SET_USERID') setUserId: Function
  @Action('setVideoSrcObj') setVideoSrcObj: Function
  @Action('setMainInfo') setMainInfo: Function
  @Action('websocketSend') send: Function
  @Getter('getRoomToken') roomToken: string

  name: string = ''
  roleName: string = ''
  address: string = ''
  isfull: boolean = false
  windowIsshow: boolean = true
  position: string = 'leftWindow'
  // rws: any = ''
  // wsUrl: string = 'ws://localhost:8080/api/voice/ws.jhtml'

//   @Prop()
//   windowIsshow: any

//   @Watch('mainInfo', { immediate: true, deep: true })
//   autoPlay (val: any, oldVal: any) {
//     console.log(val)
//     if (Object.keys(val).length !== 0) {
//       const containerElement = this.$refs.videoWrapper as HTMLElement
//       val.play(containerElement, true)
//       this.setVideoSrcObj(val.mediaStream)
//     }
//   }
mounted () {
  getUserInfo().then(res => {
    this.name = res.data.result.name;
  })
}
@Watch('mainInfo')
  onChildChanged(val: any, oldVal: any) { 
      console.log(val)
      console.log(oldVal)
      // if (this.roleName=='法官'&&val.roleName=='法官') {
      //   this.windowIsshow=false
      // }else{
      //   this.windowIsshow=true
      // }
  }
    // async mounted () {
    //     userDetail(this.userInfo.id).then(res => {
    //         if (res.data.state === 100) {
    //             this.name = res.data.result.name
    //             this.roleName = res.data.result.roleName
    //             this.address = res.data.result.address
    //             if (this.roleName=='法官') {
    //                 this.position='mindleWindow'
    //             }else if (this.roleName=='被告') {
    //                 this.position='rightWindow'
    //             }else if (this.roleName=='原告') {
    //                 this.position='leftWindow'
    //             }else{
    //                 this.position='leftWindow'
    //             }
    //             this.setMainInfo({ name: this.name, roleName: this.roleName })
    //         }
    //     })
    // }

    openFull () {
        const containerElement = this.$refs.videoWrapper as HTMLElement
        const localVideo = containerElement.children[1] as HTMLVideoElement
        this.setVideoSrcObj(localVideo.srcObject)
        this.setMainInfo({ name: this.name, roleName: this.roleName })
        // if (this.roleName=='法官') {
        //     this.windowIsshow=false
        // }else{
        //     this.windowIsshow=true
        // }
        // console.log(this.mainInfo)
    }

    destroyed () {
        this.setVideoSrcObj(new MediaStream())
    }
}
