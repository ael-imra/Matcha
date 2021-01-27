const express = require('express')
const router = express.Router()

router.get('/:usernameOwner', async (req, res) => {
  const locals = req.app.locals
  if (req.params && req.params.usernameOwner)
  {
    const IdUserReceiver = await locals.getIdUserOwner(req.params.usernameOwner)
    const avgRatingValue = await locals.select('Rating','SUM(RatingValue)/Count(*) AS "AVG"',{IdUserReceiver})
    locals.sendResponse(res,200,avgRatingValue && avgRatingValue.length > 0 && avgRatingValue[0].AVG ? avgRatingValue[0].AVG.toString() : '0')
  }
  else locals.sendResponse(res,400,'bad request')
})
router.post('/', async (req, res) => {
  const {usernameReceiver,RatingValue} = req.body
  if (
    usernameReceiver &&
    RatingValue &&
    RatingValue >= 0 &&
    RatingValue <= 5
  ) {
    const locals = req.app.locals
    const IdUserReceiver = await locals.getIdUserOwner(usernameReceiver)
    const resultCheckRating = await locals.select('Rating','*',{IdUserOwner:req.userInfo.IdUserOwner,IdUserReceiver})
    if (resultCheckRating.length > 0) {
      const resultUpdateRating = await locals.update('Rating',{RatingValue},{IdUserOwner:req.userInfo.IdUserOwner,IdUserReceiver})
      if (resultUpdateRating) locals.sendResponse(res,200,RatingValue.toString())
      else locals.sendResponse(res,403,'Error Update Rating')
    } else {
      const resultInsertRating = await locals.insert('Rating',{IdUserOwner:req.userInfo.IdUserOwner,IdUserReceiver,RatingValue})
      if (resultInsertRating)
      {
        const avgRatingValue = await locals.select('Rating','SUM(RatingValue)/Count(*) AS "AVG"',{IdUserReceiver})
        locals.sendResponse(res,200,avgRatingValue && avgRatingValue.length > 0 && avgRatingValue[0].AVG ? avgRatingValue[0].AVG.toString() : '0')
      }else locals.sendResponse(res,400,'Error On Insert Rating Value')
    }
    locals.notification(req,'Rate',req.userInfo.UserName,usernameReceiver)
  }
  else locals.sendResponse(res,400,'Bad Request')
})
module.exports = router
