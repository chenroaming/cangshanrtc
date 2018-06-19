import { Component, Vue } from 'vue-property-decorator'
import { Getter, Action, Mutation } from 'vuex-class'
import { MainPlayer } from '../../components/MainPlayer'
import { LocalPlayer } from '../../components/LocalPlayer'
import { RemotePlayer } from '../../components/RemotePlayer'
import { ChatWindow } from '../../components/ChatWindow'
import { EvidenceWindow } from '../../components/EvidenceWindow'
import { piliRTC } from '../../utils/pili'
import { Stream, User, deviceManager } from 'pili-rtc-web'
import { userDetail } from '../../api/user'
import { exportLog } from '../../api/export'
import { finish } from '../../api/case'
import RWS from '../../utils/rws'

import './roomPage.less'

interface UserInfoShape {
  id: number,
  name: string,
  role: string
}

@Component({
  template: require('./roomPage.html'),
  components: {
    MainPlayer,
    LocalPlayer,
    RemotePlayer,
    ChatWindow,
    EvidenceWindow
  }
})

export class RoomPage extends Vue {
  @Getter('getRoomToken') roomToken: string
  @Mutation('SET_USERID') setUserId: Function
  @Getter('getUserId') userId: string
  @Getter('getMessage') logMessage: Array<any>
  @Getter('getCaseNo') caseNo: string
  @Getter('getCaseId') caseId: number
  @Getter('getUserInfo') userInfo: UserInfoShape
  @Action('cleanMessage') cleanMsg: Function
  @Getter('getWebsocket') websocket: RWS

  users: Array<any> = []
  evidenceShow: boolean = false
  logShow: boolean = false
  message: string = ''
  week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  clock = {
    date: '',
    time: '',
    week: ''
  }
  timer: any

  created () {
    this.$swal({
      title: '庭审纪律',
      html: `
        <div style="text-align:left;margin-bottom:5px;text-indent:2em;">全体人员在庭审活动中应当服从审判长或独任审判员的指挥，尊重司法礼仪，遵守法庭纪律：</div>
        <div style="text-align:left;margin-bottom:5px;text-indent:2em;">(一)不得鼓掌、喧哗；</div>
        <div style="text-align:left;margin-bottom:5px;text-indent:2em;">(二)不得吸烟、进食；</div>
        <div style="text-align:left;margin-bottom:5px;text-indent:2em;">(三)不得拨打或接听电话；</div>
        <div style="text-align:left;margin-bottom:5px;text-indent:2em;">(四)不得对庭审活动进行录音、录像、拍照或使用移动通信工具等传播庭审活动；</div>
        <div style="text-align:left;margin-bottom:5px;text-indent:2em;">(五)不得实施其他危害法庭安全或妨害法庭秩序的行为。诉讼参与人发言或提问，应当经审判长或独任审判员许可。旁听人员不得进入审判活动区，不得随意站立、走动，不得发言和提问。</div>
      `,
      imageUrl: '/dist/images/tu-s.png',
      confirmButtonText: '明白',
      allowOutsideClick: false
    })

    // 情况语音列表
    this.cleanMsg()

    this.timer = setInterval(() => {
      this.updateTime()
    }, 1000)

    piliRTC.on('user-join', user => {
      console.log('user-join')
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

      // 本地推流
      try {
        console.log('publish')
        const publishInfo = await piliRTC.publish(localStream)
        console.log(publishInfo)
        this.setUserId(publishInfo.userId)
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
    console.log(this.users)
  }

  destroyed () {
    piliRTC.leaveRoom()
    clearInterval(this.timer)
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

  async outRoom () {
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
        eleLink.href = 'https://dq.hlcourt.gov.cn' + res.data.result
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

  updateTime () {
    let cd = new Date()
    this.clock.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2)
    this.clock.date = this.zeroPadding(cd.getFullYear(), 4) + '年' + this.zeroPadding(cd.getMonth() + 1, 2) + '月' + this.zeroPadding(cd.getDate(), 2) + '日'
    this.clock.week = this.week[cd.getDay()]
  }
  zeroPadding (num, digit) {
    let zero = ''
    for (let i = 0; i < digit; i++) {
      zero += '0'
    }
    return (zero + num).slice(-digit)
  }
}
