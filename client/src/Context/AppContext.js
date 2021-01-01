import React, { useState, createContext } from 'react'

export const DataContext = createContext()
export default function AppContext(props) {
  const [Mode, changeMode] = useState('Light')
  const [Lang, changeLang] = useState(0)
  const [ErrorMessages, ChangeErrorMessages] = useState({
    error: '',
    warning: '',
    success: '',
  })
  const cacheMessages = {};
  let usersData = [];

  return (
    <DataContext.Provider
      value={{
        Mode,
        changeMode,
        Lang,
        changeLang,
        ErrorMessages,
        ChangeErrorMessages,cacheMessages,usersData
      }}
    >
      {props.children}
    </DataContext.Provider>
  )
}
