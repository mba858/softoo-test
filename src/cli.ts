#!/usr/bin/env node
import { calculateStockLevel } from "./main";

calculateStockLevel("LTV719449/39/39")
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
