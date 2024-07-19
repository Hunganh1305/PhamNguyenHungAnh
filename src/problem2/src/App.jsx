import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Typography, Box } from "@mui/material";
import { Formik, Form, Field } from "formik";
import "./App.css";

function App() {
  const [tokens, setTokens] = useState([]);
  const [amount, setAmount] = useState("");
  const [exchangedToken, setExchangedToken] = useState({
    price: 0,
    fromCurrency: "",
    toCurrency: "",
  });
  const getTokenIconUrl = (symbol) => {
    return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`;
  };

  const validate = (values) => {
    const errors = {};
    if (!values.fromCurrency) {
      errors.fromCurrency = "Please choose the token";
    }
    if (!values.toCurrency) {
      errors.toCurrency = "Please choose the token";
    }
    if (!values.amount) {
      errors.amount = "Required! Input the amount please";
    } else if (values.amount <= 0) {
      errors.amount = "Must be positive";
    }
    return errors;
  };

  useEffect(() => {
    fetch(`https://interview.switcheo.com/prices.json`)
      .then((res) => res.json())
      .then((res) => {
        setTokens(res);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (values) => {
    const { fromCurrency, toCurrency, amount } = values;
    const fromPrice = fromCurrency.price;
    const toPrice = toCurrency.price;
    const exchangedAmount = (amount * fromPrice) / toPrice;
    setAmount(amount);
    setExchangedToken({
      price: exchangedAmount,
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
    });
  };

  return (
    <div className="container">
      <div class="rounded-circle">
        <svg
          viewBox="0 0 1026 1026"
          fill="none"
          aria-hidden="true"
          class="spin"
        >
          <path
            class="stroke-white/10"
            d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
            stroke-opacity="0.7"
          ></path>
          <path
            d="M513 1025C230.23 1025 1 795.77 1 513"
            stroke="url(#:S2:-gradient-1)"
            stroke-linecap="round"
          ></path>
          <defs>
            <linearGradient
              id=":S2:-gradient-1"
              x1="1"
              y1="513"
              x2="1"
              y2="1025"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#9F9164"></stop>
              <stop offset="1" stop-color="#9F9164" stop-opacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="scale-circle"></div>

      <div class="rectangle1 "></div>
      <div className="currency-converter">
        <Typography className="title" variant="h3" component="h1" gutterBottom>
          Currency Swap
        </Typography>
        <Formik
          initialValues={{ fromCurrency: "", toCurrency: "", amount: "" }}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="form">
              <Box mb={2}>
                <Field name="amount">
                  {({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      fullWidth
                      label="Amount"
                      error={touched.amount && !!errors.amount}
                      helperText={touched.amount && errors.amount}
                      variant="outlined"
                      className="textField"
                    />
                  )}
                </Field>
              </Box>
              <Box mb={2}>
                <Field
                  name="fromCurrency"
                  as={TextField}
                  select
                  fullWidth
                  label="From Currency"
                  error={touched.fromCurrency && !!errors.fromCurrency}
                  helperText={touched.fromCurrency && errors.fromCurrency}
                >
                  {tokens.map((token, index) => (
                    <MenuItem
                      key={index}
                      value={token}
                      className="currency-dropdown"
                    >
                      <img
                        src={getTokenIconUrl(token.currency)}
                        alt={token.currency}
                        width={20}
                        height={20}
                        style={{ marginRight: 8 }}
                      />
                      {token.currency}
                    </MenuItem>
                  ))}
                </Field>
              </Box>
              <Box mb={2}>
                <Field
                  name="toCurrency"
                  as={TextField}
                  select
                  fullWidth
                  label="To Currency"
                  error={touched.toCurrency && !!errors.toCurrency}
                  helperText={touched.toCurrency && errors.toCurrency}
                >
                  {tokens.map((token, index) => (
                    <MenuItem
                      key={index}
                      value={token}
                      className="currency-dropdown"
                    >
                      <img
                        src={getTokenIconUrl(token.currency)}
                        alt={token.currency}
                        width={20}
                        height={20}
                        style={{ marginRight: 8 }}
                      />
                      {token.currency}
                    </MenuItem>
                  ))}
                </Field>
              </Box>

              <Button
                className="submit-button"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Swap
              </Button>

              {exchangedToken.price !== 0 && (
                <p className="exchange-rate-result">
                  {amount} {exchangedToken.fromCurrency.currency} ={" "}
                  {exchangedToken.price.toFixed(5)}{" "}
                  {exchangedToken.toCurrency.currency}{" "}
                </p>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default App;
