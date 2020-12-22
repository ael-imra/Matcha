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

	return (
		<DataContext.Provider value={{ Mode, changeMode, Lang, changeLang, ErrorMessages, ChangeErrorMessages }}>
			{props.children}
		</DataContext.Provider>
	)
}
