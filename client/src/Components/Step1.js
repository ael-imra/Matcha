import React from 'react'
import '../Css/inputDate.css'
import { useWindowSize } from './UseWindowSize'

const Step1 = (props) => {
	const width = useWindowSize()
	function getAge(dateString) {
		let today = new Date()
		let birthDate = new Date(dateString)
		let age = today.getFullYear() - birthDate.getFullYear()
		let m = today.getMonth() - birthDate.getMonth()
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--
		}
		return age
	}
	function isValidDate(dateString) {
		let regex_date = /^\d{4}-\d{1,2}-\d{1,2}$/

		if (!regex_date.test(dateString)) {
			return false
		}
		let parts = dateString.split('-')
		let day = parseInt(parts[2], 10)
		let month = parseInt(parts[1], 10)
		let year = parseInt(parts[0], 10)
		if (year < 1000 || year > 3000 || month === 0 || month > 12) {
			return false
		}
		let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
			monthLength[1] = 29
		}
		return day > 0 && day <= monthLength[month - 1]
	}
	return (
		<div>
			<p
				className='t3'
				style={{
					marginBottom: '37px',
					marginTop: '0px',
					color: props.Mode === 'Dark' ? 'white' : 'black',
					fontSize: width <= 885 ? '18px' : '28px',
				}}>
				what's your date of birth ?
			</p>
			<input
				type='date'
				className='InputDate'
				style={{ color: props.Mode === 'Dark' ? 'white' : 'black' }}
				onChange={(e) => {
					let DataStep1 = props.InfoStep
					if (isValidDate(e.target.value))
						if (getAge(e.target.value) >= 18) DataStep1.step1 = e.target.value
						else DataStep1.step1 = ''
					else DataStep1.step1 = ''
					props.ChangeInfoStep({ ...DataStep1 })
				}}
				defaultValue={props.InfoStep.step1 !== '' ? props.InfoStep.step1 : '2015-07-25'}
			/>
		</div>
	)
}

export default Step1
