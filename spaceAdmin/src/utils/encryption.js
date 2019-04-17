import MD5 from 'md5'
import { Base64 } from 'js-base64'

function encrypt (pwd) {
  const privateKey = MD5('kangyun3d')
  let x = 0
  let currentPrivateKey = ''
  let currentPwd = ''

  for (let i = 0; i < pwd.length; i++) {
    if (x === privateKey.length) {
      x = 0
    } else {
      currentPrivateKey += privateKey[x]
      x++
    }
  }

  for (let i = 0; i < pwd.length; i++) {
    const str = pwd[i] + currentPrivateKey[i]
    currentPwd += str
  }
  return Base64.encode(currentPwd)
}

export default encrypt
