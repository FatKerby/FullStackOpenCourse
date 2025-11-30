import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'TURN_ON':
      console.log("action.payload.content:");
      console.log(action.payload.content);
      
      
      return state = action.payload.content
    case 'TURN_OFF':
      return state = ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={ [notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationHandler = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  const dispatch = notificationAndDispatch[1]
  return (payload) => {
    dispatch({ type: "TURN_ON", payload })
    setTimeout(() => {
      dispatch({ type: "TURN_OFF", payload })
    }, 5000)
  }
}

export default NotificationContext