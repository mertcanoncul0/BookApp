import { sendErrorResponse } from "@/lib/helper"
import HistoryModel from "@/models/history"
import { UpdatedHistoryRequestHandler } from "@/types"
import { RequestHandler } from "express"
import { isValidObjectId } from "mongoose"

export const updateBookHistory: UpdatedHistoryRequestHandler = async (
  req,
  res
) => {
  const { highlights, bookId, lastLocation, remove } = req.body

  let history = await HistoryModel.findOne({
    bookId,
    reader: req.user.id,
  })

  if (!history) {
    history = new HistoryModel({
      reader: req.user.id,
      bookId,
      lastLocation,
      highlights,
    })
  } else {
    if (lastLocation) history.lastLocation = lastLocation
    if (highlights?.length && !remove) history.highlights.push(...highlights)

    if (highlights?.length && remove) {
      history.highlights = history.highlights.filter(
        (item) => !highlights.find((h) => h.selection === item.selection)
      )
    }
  }

  await history.save()

  res.send()
}

export const getBookHistory: RequestHandler = async (req, res) => {
  const { bookId } = req.params

  if (!isValidObjectId(bookId))
    sendErrorResponse({
      res,
      status: 422,
      message: "Invalid book id",
    })

  const history = await HistoryModel.findOne({
    bookId,
    reader: req.user.id,
  })

  if (!history)
    return sendErrorResponse({
      res,
      status: 404,
      message: "History not found",
    })

  const formattedHistory = {
    lastLocation: history.lastLocation,
    highlights: history.highlights.map((h) => ({
      fill: h.fill,
      selection: h.selection,
    })),
  }

  res.send({ history: formattedHistory })
}
