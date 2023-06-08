import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">    
       <CardActionArea>
        <CardMedia
          component="img"
          image={product.image}
          width={"100%"}
          height={"100%"}
          aria-label="stars"
        />
        <CardContent>
          <Typography>{product.name}</Typography>
          <Typography>
            <b>${product.cost}</b>
          </Typography>
          <Rating name="read-only" value={product.rating} precision={0.5} />
        </CardContent>
      </CardActionArea>
      <CardActions className="card-actions">
        <Button
          variant="contained"
          className="card-button"
          onClick={handleAddToCart}
        >
          <AddShoppingCartOutlined />
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
