import { createSlice } from '@reduxjs/toolkit'

export const newNotification = (content) => {
  
  return (dispatch) => {
    dispatch(displayNotification(content))
    setTimeout(() => {
      dispatch(removeNotification())
      }, 5000
    )
    }
  }

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    displayNotification(state, action) {
      return state = action.payload
    },
    removeNotification(state) {
      return state = ''
    }
  }
})

export const { displayNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer