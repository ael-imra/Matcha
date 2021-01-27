import React, { useState, useEffect, useRef } from 'react'
import '../Css/ImageLoader.css'
function ImageLoader(props) {
  const [imageLoaded, changeImageLoaded] = useState(false)
  const imageRef = useRef(null)
  useEffect(() => {
    let unmount = false
    fetch(props.src)
      .then((res) => res.blob())
      .then((data) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (!unmount) {
              changeImageLoaded(true)
              if (imageRef.current) imageRef.current.src = reader.result
            }
          }
          reader.readAsDataURL(data)
      })
    return () => (unmount = true) // eslint-disable-next-line
  }, [])
  return (
    <div
      className={`${props.className ? props.className : ''} ImageLoader`}
      style={props.style ? props.style : {}}
    >
      {imageLoaded ? (
        <img ref={imageRef} alt={props.alt} />
      ) : (
        <div className="ImageLoading"></div>
      )}
    </div>
  )
}
export { ImageLoader }
