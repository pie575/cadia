import React from "react"

import b from "./back.svg"

function Card(props) {
  const {card, front = true, back, Component, height, style = {}, className = "card"} = props;
  style.height = height;

  if (back) {
    return (
      <div class={className}>
        <img src={b} className={`card`} alt={card} style={style} />
      </div>
    )
  }

  if (front) {
    return (
      <div class={className}>
        <img src={card} className={`card`} alt={card} style={style} />
      </div>
    )
  }
}

export default Card
