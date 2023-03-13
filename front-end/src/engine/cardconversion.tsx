import { Card } from "./Card";

const convertCardstoStrings = (cards: Card[]) => {
  const cardStrings: string[] = [];
  for (let i = 0; i < cards.length; i += 1) {
    let card = "";
    let value = `${cards[i].value}`;
    if (cards[i].value >= 10) {
      if (cards[i].value === 10) {
        value = "T";
      } else if (cards[i].value === 11) {
        value = "J";
      } else if (cards[i].value === 12) {
        value = "Q";
      } else if (cards[i].value === 13) {
        value = "K";
      } else if (cards[i].value === 14) {
        value = "A";
      }
    }
    card += value;
    if (cards[i].suit === "SPADE") {
      card += "s";
    } else if (cards[i].suit === "HEART") {
      card += "h";
    }
    if (cards[i].suit === "DIAMOND") {
      card += "d";
    }
    if (cards[i].suit === "CLUB") {
      card += "c";
    }
    cardStrings.push(card);
  }
  return cardStrings;
};

export default convertCardstoStrings;
