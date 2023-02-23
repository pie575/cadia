import React from "react"

import Card from "./Card"

// two color big face
import tcbf2c from "./2C.svg"
import tcbf3c from "./3C.svg"
import tcbf4c from "./4C.svg"
import tcbf5c from "./5C.svg"
import tcbf6c from "./6C.svg"
import tcbf7c from "./7C.svg"
import tcbf8c from "./8C.svg"
import tcbf9c from "./9C.svg"
import tcbfTc from "./TC.svg"
import tcbfJc from "./JC.svg"
import tcbfQc from "./QC.svg"
import tcbfKc from "./KC.svg"
import tcbfAc from "./AC.svg"

import tcbf2d from "./2D.svg"
import tcbf3d from "./3D.svg"
import tcbf4d from "./4D.svg"
import tcbf5d from "./5D.svg"
import tcbf6d from "./6D.svg"
import tcbf7d from "./7D.svg"
import tcbf8d from "./8D.svg"
import tcbf9d from "./9D.svg"
import tcbfTd from "./TD.svg"
import tcbfJd from "./JD.svg"
import tcbfQd from "./QD.svg"
import tcbfKd from "./KD.svg"
import tcbfAd from "./AD.svg"

import tcbf2h from "./2H.svg"
import tcbf3h from "./3H.svg"
import tcbf4h from "./4H.svg"
import tcbf5h from "./5H.svg"
import tcbf6h from "./6H.svg"
import tcbf7h from "./7H.svg"
import tcbf8h from "./8H.svg"
import tcbf9h from "./9H.svg"
import tcbfTh from "./TH.svg"
import tcbfJh from "./JH.svg"
import tcbfQh from "./QH.svg"
import tcbfKh from "./KH.svg"
import tcbfAh from "./AH.svg"

import tcbf2s from "./2S.svg"
import tcbf3s from "./3S.svg"
import tcbf4s from "./4S.svg"
import tcbf5s from "./5S.svg"
import tcbf6s from "./6S.svg"
import tcbf7s from "./7S.svg"
import tcbf8s from "./8S.svg"
import tcbf9s from "./9S.svg"
import tcbfTs from "./TS.svg"
import tcbfJs from "./JS.svg"
import tcbfQs from "./QS.svg"
import tcbfKs from "./KS.svg"
import tcbfAs from "./AS.svg"

const cards = {
  '2c': tcbf2c,
  '3c': tcbf3c,
  '4c': tcbf4c,
  '5c': tcbf5c,
  '6c': tcbf6c,
  '7c': tcbf7c,
  '8c': tcbf8c,
  '9c': tcbf9c,
  'Tc': tcbfTc,
  'Jc': tcbfJc,
  'Qc': tcbfQc,
  'Kc': tcbfKc,
  'Ac': tcbfAc,

  '2d': tcbf2d,
  '3d': tcbf3d,
  '4d': tcbf4d,
  '5d': tcbf5d,
  '6d': tcbf6d,
  '7d': tcbf7d,
  '8d': tcbf8d,
  '9d': tcbf9d,
  'Td': tcbfTd,
  'Jd': tcbfJd,
  'Qd': tcbfQd,
  'Kd': tcbfKd,
  'Ad': tcbfAd,

  '2h': tcbf2h,
  '3h': tcbf3h,
  '4h': tcbf4h,
  '5h': tcbf5h,
  '6h': tcbf6h,
  '7h': tcbf7h,
  '8h': tcbf8h,
  '9h': tcbf9h,
  'Th': tcbfTh,
  'Jh': tcbfJh,
  'Qh': tcbfQh,
  'Kh': tcbfKh,
  'Ah': tcbfAh,

  '2s': tcbf2s,
  '3s': tcbf3s,
  '4s': tcbf4s,
  '5s': tcbf5s,
  '6s': tcbf6s,
  '7s': tcbf7s,
  '8s': tcbf8s,
  '9s': tcbf9s,
  'Ts': tcbfTs,
  'Js': tcbfJs,
  'Qs': tcbfQs,
  'Ks': tcbfKs,
  'As': tcbfAs,
}

function CardEntity(props) {
  return (
    <Card {...props} card={cards[props.card]} />
  );
}

export default CardEntity;
