import React,{useState} from 'react'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Select } from './Select'
import '../Css/Filter.css'

function Filter(props) {
  const [listActive, changeListActive] = useState(props.filterData.list)
  const [name, changeName] = useState(props.filterData.name)
  const [age, changeAge] = useState(props.filterData.age)
  const [rating, changeRating] = useState(props.filterData.rating)
  const [location, changeLocation] = useState(props.filterData.location)
  const list = [
    'Youtube',
    'Facebook',
    'Github',
    'Instagrame',
    'Twitter',
    'Hola',
    'Aliexpress',
  ]
  return (
    <div className="Filter">
      <div className="FilterSearch">
        <div className="FilterSearchInput">
          <TextField
            id="FilterName"
            label="Name"
            variant="outlined"
            size="small"
            onChange={(event) => changeName(event.target.value)}
            value={name}
          />
        </div>
      </div>
      <div className="FilterAdvance">
        <div className="FilterAdvanceFirst">
          <Select list={list} change={changeListActive} active={listActive} />
        </div>
        <div className="FilterAdvanceSecond">
          <div className="FilterAdvanceAge">
            <div className="FilterAdvanceAgeText">Age :</div>
            <div className="FilterAdvanceAgeValue">
              <Slider
                value={age}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={18}
                max={80}
                onChange={(event, value) => changeAge([...value])}
              />
            </div>
          </div>
          <div className="FilterAdvanceRating">
            <div className="FilterAdvanceRatingText">Rating :</div>
            <div className="FilterAdvanceRatingValue">
              <Slider
                value={rating}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={5}
                onChange={(event, value) => changeRating([...value])}
              />
            </div>
          </div>
          <div className="FilterAdvanceLocation">
            <div className="FilterAdvanceLoactionText">Location :</div>
            <div className="FilterAdvanceLoactionValue">
              <Slider
                value={location}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={1000}
                step={100}
                valueLabelFormat={(x) => (x === 1000 ? `${999}+` : x)}
                onChange={(event, value) => changeLocation([...value])}
              />
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              props.changeFilterData(() => ({
                list: listActive,
                name,
                age,
                rating,
                location,
                updated: true,
              }))
            }}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
export {Filter}