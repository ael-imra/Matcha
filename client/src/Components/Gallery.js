import React, { useState, useEffect } from 'react'
import { data } from '../API/Messages'
import { IconButtonNext, IconClose } from './Icons'
import { ConvertDate } from './Messages'
import { ImageLoader } from './ImageLoader'
import '../Css/Gallery.css'

function Gallery(props) {
  const [allImages, addToAllImages] = useState([])
  const [lastIndexImage, changelastIndexImage] = useState(20)
  const [galleryMainImage, changeGalleryMainImage] = useState(
    data[0] ? data[0].image : null
  )
  const [hideLoader, changeHideLoader] = useState(true)
  const [hideImageLoader, changeHideImageLoader] = useState(true)
  function removeClassNameFromItem() {
    for (let item of document.querySelectorAll('.GallerySmallSlideItem'))
      if (item.classList.contains('GallerySmallSlideItemActive'))
        item.classList.remove('GallerySmallSlideItemActive')
  }
  function slideImage(next) {
    let GallerySmallSlideItem = null
    for (let item of document.querySelectorAll('.GallerySmallSlideItem'))
      if (item.classList.contains('GallerySmallSlideItemActive'))
        GallerySmallSlideItem = item
    if (
      next &&
      GallerySmallSlideItem.nextElementSibling &&
      GallerySmallSlideItem.nextElementSibling.classList.contains(
        'GallerySmallSlideItem'
      )
    ) {
      removeClassNameFromItem()
      GallerySmallSlideItem.nextElementSibling.classList.add(
        'GallerySmallSlideItemActive'
      )
      changeGalleryMainImage(
        GallerySmallSlideItem.nextElementSibling.children[0].src
      )
    } else if (
      !next &&
      GallerySmallSlideItem.previousElementSibling &&
      GallerySmallSlideItem.previousElementSibling.classList.contains(
        'GallerySmallSlideItem'
      )
    ) {
      removeClassNameFromItem()
      GallerySmallSlideItem.previousElementSibling.classList.add(
        'GallerySmallSlideItemActive'
      )
      changeGalleryMainImage(
        GallerySmallSlideItem.previousElementSibling.children[0].src
      )
    }
  }
  function ClickImage(e) {
    removeClassNameFromItem()
    e.target.parentNode.classList.add('GallerySmallSlideItemActive')
    changeGalleryMainImage(e.target.src)
  }
  function getImages(id, lastImage) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const items = []
        let size = 10
        for (let i = lastImage; i >= 0; i--) {
          if (allImages.length === 0 && i === lastImage)
            items.push(
              <div
                className="GallerySmallSlideItem GallerySmallSlideItemActive"
                key={i}
              >
                <img
                  src={data[id].image}
                  alt={data[id].name}
                  onClick={ClickImage}
                />
              </div>
            )
          else
            items.push(
              <div className="GallerySmallSlideItem" key={i}>
                <img
                  src={data[id].image}
                  alt={data[id].name}
                  onClick={ClickImage}
                />
              </div>
            )
          size--
          if (size === 0) {
            i = 0
          }
        }
        if (items.length > 0) resolve([items, lastImage - 10])
        else reject('ERROR')
      }, 5000)
    })
    return promise
  }
  function getMoreImages() {
    changeHideLoader(false)
    getImages(0, lastIndexImage)
      .then(([items, lastImage]) => {
        changeHideImageLoader(false)
        addToAllImages((oldValue) => [...oldValue, ...items])
        changelastIndexImage(lastImage)
        changeHideLoader(true)
      })
      .catch(() => changeHideLoader(true))
  }
  useEffect(() => {
    let unmount = false
    changeHideImageLoader(true)
    getImages(0, lastIndexImage)
      .then(([items, lastImage]) => {
        if (!unmount) {
          changeHideImageLoader(false)
          addToAllImages(items)
          changelastIndexImage(lastImage)
          changeGalleryMainImage(items[0].children.props.src)
        }
      })
      .catch(() => (!unmount ? changeHideImageLoader(false) : 0))

    return () => (unmount = true) // eslint-disable-next-line
  }, [])
  return (
    <div className="Gallery" style={props.style ? props.style : {}}>
      <div className="GalleryHeader">
        <ImageLoader
          className="GalleryHeaderUserImage"
          src={data[0].image}
          alt={data[0].name}
        />
        <div className="GalleryHeaderUserInfo">
          <div className="GalleryHeaderUserName">{data[0].name}</div>
          <div className="GalleryHeaderTimeImageSent">
            {ConvertDate(data[0].date)}
          </div>
        </div>
        <div className="GalleryHeaderClose">
          <IconClose
            width={25}
            height={25}
            fill="black"
            onClick={() => props.changeHideGallery(true)}
          />
        </div>
      </div>
      <div className="GalleryBigSlide">
        <div className="GallerySwitchButton">
          <IconButtonNext
            style={{ transform: 'rotate(180deg)' }}
            width={35}
            height={35}
            fill="black"
            onClick={() => slideImage(0)}
          />
        </div>
        <ImageLoader
          className="GalleryMainImage"
          src={galleryMainImage}
          alt={data[0].name}
        />
        <div className="GallerySwitchButton">
          <IconButtonNext
            width={35}
            height={35}
            fill="black"
            onClick={() => slideImage(1)}
          />
        </div>
      </div>
      <div className="GallerySmallSlide">
        {allImages}
        {lastIndexImage > 0 && !hideImageLoader ? (
          <div
            className="GallerySmallSlideItemLoading"
            onClick={getMoreImages}
            style={
              hideLoader
                ? { animation: 'none' }
                : { animation: 'itemLoading 1.5s infinite ease-in-out' }
            }
          >
            <span>{hideLoader ? `+${lastIndexImage + 1}` : ''}</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export { Gallery }
