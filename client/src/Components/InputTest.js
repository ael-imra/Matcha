import React from 'react';
import '../Css/ft-input.css';

export default function InputTest(props) {
  let blue = (e) => {
    e.target.className = 'Input';
  };
  let focus = (e) => {
    e.target.className = 'Input input-active';
  };

  return (
    <input
      onBlur={blue}
      onFocus={focus}
      type={props.Type}
      className='Input'
      onChange={(e) => {
        props.Onchange(e.target.value);
      }}
      value={props.DefaultValue || ''}
      placeholder={props.PlaceHolder || ''}
      style={props.Style || {}}
      disabled={!props.Disabled}
    />
  );
}
