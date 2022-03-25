import CartItem from "../CartItem/CartItem";
//styles
import { Wrapper } from "./Cart.style";
//types
import { CartItemType } from "../App";

type Props = {
  items: CartItemType[];
  addToCart: (clickedItem: CartItemType) => void;
  removeFromCart: (id: number) => void;
};

const calculateTotalPrice = (items: CartItemType[]) => {
  return items.reduce((ack, item) => {
    return ack + item.amount * item.price;
  }, 0);
};

const Cart: React.FC<Props> = ({ items, addToCart, removeFromCart }) => {
  return (
    <Wrapper>
      <h2>Your shopping cart</h2>
      {items.length === 0 && <p>No items in cart</p>}
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      ))}

      <h2>Total: ${calculateTotalPrice(items).toFixed(2)}</h2>
    </Wrapper>
  );
};

export default Cart;
