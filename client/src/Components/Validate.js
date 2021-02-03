import Jimp from 'jimp'
function Validate(name, value) {
  const list = {
    // eslint-disable-next-line
    Name: /^[a-zA-Z ]{5,}$/g.test(value), // eslint-disable-next-line
    Username: /^[a-zA-Z0-9 \.\-_]{5,15}$/g.test(value), // eslint-disable-next-line
    Email: /^[a-zA-Z0-9\.\-_]{6,30}[@][a-zA-Z0-9]{3,10}[\.][a-zA-Z0-9]{2,7}$/g.test(value), // eslint-disable-next-line
    Password: /^[ -~]{8,30}$/g.test(value),
  }
  return list[name]
}
function checkImages(images) {
  return new Promise((resolve) => {
    let arr = []
    if (images.length > 0)
      images.forEach((image) => {
        let base64Data = image.split(',')
        if (base64Data.length > 1) {
          const buffer = Buffer.from(base64Data[1], 'base64')
          Jimp.read(buffer, (err, res) => {
            if (err) {
              resolve(false)
            } else {
              arr.push('ok')
            }
            if (arr.length === images.length) resolve(true)
          })
        } else resolve(false)
      })
    else resolve(false)
  })
}
export { Validate, checkImages }
