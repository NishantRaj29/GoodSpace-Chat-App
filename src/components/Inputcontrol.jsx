import React from 'react'

const Inputcontrol = (props) => {
  return (
    <div>
        { props.label && <label>{props.label}</label>}:
        <input type="text" {...props}/>
    </div>
  )
}

export default Inputcontrol