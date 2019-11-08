import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Getter, Action, Mutation } from 'vuex-class'
import { piliRTC } from '../../utils/pili'
import { userDetail } from '../../api/user'

import './remotePlayer.less'

interface UserShape {
    name: string
    roleName: string
    address: string
}

@Component({
  template: require('./remotePlayer.html')
})
export class RemotePlayer extends Vue {
  @Action('setVideoSrcObj') setVideoSrcObj: Function
  @Action('setMainInfo') setMainInfo: Function
  name: 'RemotePlayer'

  @Prop()
  id: string

  userInfo: UserShape = {
    name: '',
    roleName: '',
    address: '',
  }
  isfull: boolean = false
  windowIsshow: boolean = true
  position: string = 'leftWindow'
  windowIsShowClass: string = 'show'
  @Watch('mainInfo')
  onChildChanged(val: any, oldVal: any) {
      console.log(val)
      console.log(oldVal)
      if (this.userInfo.roleName=='法官'&&val.roleName=='法官') {
        this.windowIsshow=false
      }else{
        this.windowIsshow=true
      }
  }
  @Watch('id', { immediate: true, deep: true })
  

  async autopPlay (val: string, oldVal: string) {
    if (this.id !== undefined) {
      const stream = await piliRTC.subscribe(this.id)
      const containerElement = this.$refs.videoWrapper as HTMLElement
      stream.play(containerElement)
    
      const res = await userDetail(this.id)
      if (res.data.state === 100) {
        this.userInfo = res.data.result
        if (this.userInfo.roleName=='法官') {
            this.position='mindleWindow'
        }else if (this.userInfo.roleName=='被告') {
            this.position='rightWindow'
        }else if (this.userInfo.roleName=='原告') {
            this.position='leftWindow'
        }else{
            this.position='leftWindow'
        }
      }
    }
  }

  openFull () {
    const containerElement = this.$refs.videoWrapper as HTMLElement
    const localVideo = containerElement.children[1] as HTMLVideoElement
    this.setVideoSrcObj(localVideo.srcObject)
    this.setMainInfo(this.userInfo)
    // if (this.userInfo.roleName=='法官') {
    //     this.windowIsshow=false
    // }else{
    //     this.windowIsshow=true
    // }
  }
}
