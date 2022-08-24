import fetch from './fetch'
import errorHandler from './handler/errorHandler'
import successHandler from './handler/successHandler'

interface chatInterface {
  order_id?: string
  page?: number
  per_page?: number
}

interface roomInterface {
  order_id?: string
  page?: number
  per_page?: number
}
const findMessageHistory = async (req: chatInterface) => {
  try {
    console.log('chatHistory')
    console.log(req)
    const response = await fetch.post(`/api/chat/find-message`, req)
    return successHandler(response)
  } catch (error) {
    console.log('error')
    return errorHandler(error)
  }
}

const findAllRoom = async (req: roomInterface) => {
  try {
    console.log('room')
    const response = await fetch.post(`/api/chat/find-all-room`, req)
    console.log('res', response)
    return successHandler(response)
  } catch (error) {
    console.log('error')
    return errorHandler(error)
  }
}

export { findMessageHistory, findAllRoom }
