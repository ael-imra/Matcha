import React from 'react'
import { useWindowSize } from './UseWindowSize'

export default function Step5(props) {
	const width = useWindowSize()
	return (
		<div>
			<p
				className='t3'
				style={{
					transform: 'translateY(-180px)',
					marginTop: '0px',
					color: props.Mode === 'Dark' ? 'white' : 'black',
					fontSize: width <= 885 ? '18px' : '28px',
				}}>
				thank your for sing up in Matcha
			</p>
		</div>
	)
}
