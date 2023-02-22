import Clubs from "./clubs/clubs";
import diamonds_2 from "./diamonds_2.png"
import "../../styles/game.css"
// const Cards =  [Clubs,];
const Card1 = () => {
  return (
    <div class="card">
        <img 
        src={diamonds_2} alt="" class="card-image">
            </img>
    </div>
  );
};
const Cards = [[Card1, Card1,Card1,Card1,Card1]];

export default Cards;
