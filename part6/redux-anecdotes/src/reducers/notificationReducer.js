import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    displayNotification(state, action) {
      return state = action.payload
    }
  }
})

const { displayNotification } = notificationSlice.actions

export const newNotification = (content, timeout) => {
  return (dispatch) => {
    dispatch(displayNotification(content))
    setTimeout(() => {
        dispatch(displayNotification(''))
      }, 
      timeout * 1000 //timeout in seconds
    )
  }
}

export default notificationSlice.reducer