import { useState } from "react";
import { useQuery } from "react-query";
// conponents
import Item from "./Item/Item";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Grid } from "@material-ui/core";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";
import { Wrapper, Button } from "./App.styles";
import Cart from "./Cart/Cart";
// types
export type CartItemType = {
  id: number;
  cathegory: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProducts = async (): Promise<CartItemType[]> => {
  const response = await fetch("https://fakestoreapi.com/products");
  const data = await response.json();

  return data;
};

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );

  const getTotalItems = (items: CartItemType[]): number => {
    return items.reduce((ack: number, item) => ack + item.amount, 0);
  };

  const handleAddToCart = (cartItem: CartItemType) => {
    setCartItems((prev) => {
      const index = prev.findIndex((item) => item.id === cartItem.id);

      if (index === -1) {
        return [...prev, { ...cartItem, amount: 1 }];
      }

      return prev.map((item) =>
        item.id === cartItem.id ? { ...item, amount: item.amount + 1 } : item
      );
    });

    console.log(cartItems);
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) => {
      return prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) {
            return ack;
          } else {
            return [...ack, { ...item, amount: item.amount - 1 }];
          }
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[]);
    });
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong...</div>;

  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          addToCart={handleAddToCart}
          items={cartItems}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>

      <Button onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </Button>

      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4} lg={3}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
