import Util from '../utils/util'

let service = Util.axios

/**
 * [通过案号查询按键列表接口]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function caseList (caseNo,pageNumber) {
  const params = {
    caseNo,
    pageNumber
  }
  return service({
    url: '/online/caseList.jhtml',
    method: 'get',
    params
  })
}

export function getRoomToken (caseId,roomType) {
  const params = {
    caseId,
    roomType
  }
  return service({
    url: '/online/getRoomToken.jhtml',
    method: 'get',
    params
  })
}

export function voice (blob) {
  const data = blob
  return service({
    url: '/online/voice.jhtml',
    method: 'post',
    data
  })
}

export function finish () {
  return service({
    url: '/online/finish.jhtml',
    method: 'get'
  })
}
export function createImg () {
    return service({
      url: '/online/createImg.jhtml',
      method: 'get'
    })
  }

  /**
 * [进入房间新]
 * @param {string}
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function intoRoom (caseId) {
  const params = {
    caseId//房间id
  }
  return service({
    url: '/court/room/intoRoom.jhtml',
    method: 'post',
    params
  })
}


  /**
 * [退出房间新]
 * @param {string} 
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function closeRoom (recordId) {
  const params = {
    recordId //调解记录id
    
  }
  return service({
    url: '/court/room/closeRoom.jhtml',
    method: 'post',
    params
  })
}

/**
 * [开始调解新]
 * @param {string} hallId [议理堂]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function startMediate () {
  // const params = {
  //   hallId,//议理堂
  //   pant1,//申请人id
  //   pant2,//被申请人id
  //   judicialId//司法局id
    
  // }
  return service({
    url: '/mediate/startMediate.jhtml',
    method: 'post',
  })
}

/**
 * [结束调解新]
 * @param {string} hallId [议理堂]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function endMediate () {
  // const params = {
  //   hallId,//议理堂
  //   pant1,//申请人id
  //   pant2,//被申请人id
  //   judicialId//司法局id
    
  // }
  return service({
    url: '/mediate/endMediate.jhtml',
    method: 'post',
  })
}


// /**
//  * [查询法院/司法院/申请人/被申请人新]
//  * @param {string} caseNo [案号]
//  * @returns { state: number, message: string } [state:100 成功；101 失败]
//  */
// export function getByRoomId () {
//   // const params = {
//   //   roomId,
//   //   type//0法院 1司法院 2申请人 3被申请人
//   // }
//   return service({
//     url: '/participant/getByRoomId.jhtml',
//     method: 'get',
//   })
// }

/**
 * [查询法院/司法院/申请人/被申请人新]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getByRoomId (caseId) {
  const params = {
    caseId
  }
  return service({
    url: '/court/case/getLitInfoByCaseId.jhtml',
    method: 'get',
    params
  })
}


/**
 * [根据id查询参与人新]
 * @param {string} pantId [申请人Id]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getById (pantId) {
  const params = {
    pantId
  }
  return service({
    url: '/participant/getById.jhtml',
    method: 'get',
    params
  })
}

/**
 * [新增修改参与人新]
 * @param {string}
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
// export function changePar1 (pantId,type,mediateNo,name,phone,idCard,address) {
//   const params = {
//     pantId,
//     type,
//     mediateNo,
//     name,
//     phone,
//     idCard,
//     address
//   }
//   return service({
//     url: '/participant/changePar.jhtml',
//     method: 'post',
//     params
//   })
// }

/**
 * [新增修改参与人新]
 * @param {string}
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function changePar (data) {
  // const params = JSON.stringify({
  //   mediateNo,pantList
  // })
  return service({
    url: '/participant/changePar.jhtml',
    method: 'post',
    data
  })
}

/**
 * [新增司法局新]
 * @param {string}
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
// export function changePar2 (pantId,type,judicialName) {
//   const params = {
//     pantId,
//     type,
//     judicialName
//   }
//   return service({
//     url: '/participant/changePar.jhtml',
//     method: 'post',
//     params
//   })
// }


/**
 * [删除参与人新]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function delParticipant (pantId) {
  const params = {
    pantId
  }
  return service({
    url: '/participant/delParticipant.jhmtl',
    method: 'post',
    params
  })
}

/**
 * [查询单个房间调解记录]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getRecord1 (caseId,pageNum,pageSize) {
  const params = {
    caseId,
    pageNum,
    pageSize
  }
  return service({
    url: '/court/protocol/getProtocolByCaseId.jhtml',
    method: 'get',
    params
  })
}

/**
 * [查询具体调解记录]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getRecord2 (recordId) {
  const params = {
    recordId
  }
  return service({
    url: '/mediate/getRecord.jhtml',
    method: 'get',
    params
  })
}


// /**
//  * [查询文件名]
//  * @param {string} caseNo [案号]
//  * @returns { state: number, message: string } [state:100 成功；101 失败]
//  */
// export function getFileName (caseId) {
//   const params = {
//     caseId
//   }
//   return service({
//     url: '/court/protocol/getProtocolParam.jhtml',
//     method: 'get',
//     params
//   })
// }


/**
 * [查询文件名]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getFileName (caseId) {
  const params = {
    caseId
  }
  return service({
    url: 'court/protocol/getProtocolUrl.jhtml',
    method: 'get',
    params
  })
}

/**
 * [获取记录ID]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getRecordId (hallId) {
  const params = {
    hallId
  }
  return service({
    url: '/mediate/getRecordId.jhtml',
    method: 'get',
    params
  })
}

/**
 * [获取签名二维码]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function createImg2 (caseId) {
  const params = {
    caseId
  }
  return service({
    url: '/court/protocol/createImg.jhtml',
    method: 'post',
    params
  })
}

/**
 * [下载协议]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function downloadPro (recordId) {
  const params = {
    recordId
  }
  return service({
    url: '/mediate/downloadPro.jhtml',
    method: 'get',
    params
  })
}

/**
 * [获取最大解调号]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getMaxNo () {
  return service({
    url: '/mediate/getMaxNo.jhtml',
    method: 'get',
  })
}


// /**
//  * [获取证据列表]
//  * @param {string} caseNo [案号]
//  * @returns { state: number, message: string } [state:100 成功；101 失败]
//  */
// export function getProofByRecordId (recordId) {
//   const params = {
//     recordId
//   }
//   return service({
//     url: '/mediate/proof/getProofByRecordId.jhtml',
//     method: 'get',
//     params
//   })
// }

/**
 * [获取证据列表]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getProofByRecordId (caseId) {
  const params = {
    caseId
  }
  return service({
    url: '/court/proof/getProofByCaseId.jhtml',
    method: 'get',
    params
  })
}

/**
 * [获取上传证据的二维码]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getProofImg (caseId) {
  const params = {
    caseId
  }
  return service({
    url: '/court/proof/getProofImg.jhtml',
    method: 'post',
    params
  })
}

/**
 * [实时同步证据]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getProof (proofId) {
  const params = {
    proofId
  }
  return service({
    url: '/mediate/proof/getProof.jhtml',
    method: 'get',
    params
  })
}

/**
 * [获取调解协议要素]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getProtocolParam (caseId) {
  const params = {
    caseId
  }
  return service({
    url: '/court/protocol/getProtocolParam.jhtml',
    method: 'get',
    params
  })
}

/**
 * [获取调解协议要素2]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function getProtocolParam2 () {
  return service({
    url: '/mediate/protocol/getProtocolParam.jhtml',
    method: 'get'
  })
}

/**
 * [保存调解协议要素]
 * @param {string} caseNo [案号]
 * @returns { state: number, message: string } [state:100 成功；101 失败]
 */
export function saveProParam (caseId,agreement,fact,method) {
  // const params = JSON.stringify({
  //   mediateNo,pantList
  // })
  const params = {
    caseId,
    agreement,
    fact,
    method,
  }
  return service({
    url: '/court/protocol/saveProParam.jhtml',
    method: 'get',
    params
  })
}