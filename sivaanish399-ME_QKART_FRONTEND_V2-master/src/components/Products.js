import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import Productcard from "./ProductCard";
import SearchIcon from "@mui/icons-material/Search";
import Cart,{ generateCartItemsFrom } from "./Cart"

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);
    let value = [];
    try {
      let res = await axios.get(`${config.endpoint}/products`);
      value = res.data;
      setProducts(value);
      setFilteredProducts(value);
    } catch (err) {
      if (!err.response.data.sucess) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      }
    }
    setLoading(false);
  };


 

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setLoading(true);
    try {
      let res = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setFilteredProducts(res.data);
    } catch (error) {
      if (error.response.status === 404) {
        setFilteredProducts([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    performAPICall();
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const [debounceTimeout, setDebounceTimeout] = useState(0);

  const debounceSearch = (event, debounceTimeout) => {
    let value = event.target.value;

    if (debounceTimeout) clearTimeout(debounceTimeout);
    setDebounceTimeout(setTimeout(() => performSearch(value), 800));
  };


  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      let res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  useEffect(() => {
    fetchCart(token)
      .then((cartData) => generateCartItemsFrom(cartData, products))
      .then((cartItem) => setItems(cartItem));
  }, [products])

  const isItemInCart = (items, productId) => {
    if (items.length) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].productId === productId) return true;
      }
    }
    return false;
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }
    try {
      let url = `${config.endpoint}/cart`;
      let data = { productId: productId, qty: qty };
      let res = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res)
      setItems(generateCartItemsFrom(res.data, products));
    } catch (error) {
      if (error.response )  {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  }

  return (
    <div>
      <Header hasHiddenAuthButtons="yes">
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            debounceSearch(event, debounceTimeout);
          }}
        />
      </Header>
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={(event) => {
          setSearch(event.target.value);
          debounceSearch(event, debounceTimeout);
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item md={token ? 9 : 12} sm={12}>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
            <Grid item md={12} xs={12}>
              {isLoading ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "40vh" }}
                >
                  <CircularProgress />
                  <h4>Loading Products...</h4>
                </Box>
              ) : filteredProducts.length ? (
                <Grid
                  container
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  marginY={1}
                >
                  {filteredProducts.map(function (pd) {
                    return (
                      <Grid item md={3} xs={6} key={pd._id}>
                        <Productcard 
                        product={pd} 
                        handleAddToCart={() =>
                          addToCart(token, items, products, pd._id, 1, {
                            preventDuplicate: true,
                          })
                        }
                        />
                        
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "40vh" }}
                >
                  <SentimentDissatisfied />
                  <h4>No products found</h4>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
        {token && (
        <Grid item md={3} sm={12} xs={12} backgroundColor="#E9F5E1">
          <Cart
              products={products}
              items={items}
              handleQuantity={addToCart}
            />
        </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
