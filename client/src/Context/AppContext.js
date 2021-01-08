import React, { useState, createContext } from 'react';
import axios from 'axios'

export const DataContext = createContext();
export default function AppContext(props) {
  const [Mode, changeMode] = useState('Light');
  const [Lang, changeLang] = useState(0);
  const [userInfo, changeUserInfo] = useState({});
  const [ErrorMessages, ChangeErrorMessages] = useState({
    error: '',
    warning: '',
    success: '',
  })
  const [filterData, changeFilterData] = useState({
    list: [],
    name: '',
    age: [18, 88],
    rating: [0, 5],
    location: [0, 1000],
    updated: false,
  })
  const [usersData,changeUsersData] = useState([])
  const Cache = {
    messages:[],
  }

  function getUsersData(length) {
    return axios.post(`Users`, { ...filterData, start:usersData.length,length })
  }

  return (
    <DataContext.Provider
      value={{
        Mode,
        changeMode,
        Lang,
        changeLang,
        ErrorMessages,
        ChangeErrorMessages,
        userInfo,
        changeUserInfo,
        filterData,
        changeFilterData,
        usersData,
        changeUsersData,
        getUsersData
      }}>
      {props.children}
    </DataContext.Provider>
  );
}
