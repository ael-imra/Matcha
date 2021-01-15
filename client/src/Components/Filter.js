import React, { useState,useContext } from 'react'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Select } from './Select'
import { DataContext } from '../Context/AppContext'
import '../Css/Filter.css'

function Filter() {
  const ctx = useContext(DataContext)
  const [listActive, changeListActive] = useState(ctx.filterData.list)
  const [name, changeName] = useState(ctx.filterData.name)
  const [age, changeAge] = useState(ctx.filterData.age)
  const [rating, changeRating] = useState(ctx.filterData.rating)
  const [location, changeLocation] = useState(ctx.filterData.location)
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
              ctx.filterData = {
                list: listActive,
                name,
                age,
                rating,
                location,
                updated: true,
              }
            }}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
export { Filter }
