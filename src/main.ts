import * as fs from "fs";
import * as path from "path";
import { Stock } from "./models/stock";
import { Transaction } from "./models/transaction";

/**
 * Return Current Stock for given sku
 * @param {*} sku:string
 * @returns Promise<{ sku: string, qty: number }>
 */
export const calculateStockLevel = (
  sku: string
): Promise<{ sku: string; qty: number }> => {
  return new Promise((resolve, reject) => {
    try {
      let stocks: Stock[] = getJsonFileContent("./data/stock.json");
      let transactions: Transaction[] = getJsonFileContent(
        "./data/transactions.json"
      );

      // Using find method get the first occurrence of the stock
      let STOCK = stocks.find((stk: Stock) => stk.sku == sku),
        initialStockNotFound,
        noStockFoundFromTransactions,
        totalTransactions = 0;
      if (!STOCK) {
        STOCK = { sku, stock: 0 };
        initialStockNotFound = true;
      }
      let totalOldStock = STOCK.stock;

      /**
       * Using filter, map and reduce we get the total quantity of the stocks
       */
      let skuTransactions = transactions.filter(
        (tx: Transaction) => tx.sku == sku
      );
      if (skuTransactions.length == 0) noStockFoundFromTransactions = true;

      /**
       * Order type transactions will decrease the stock and refund type transaction will
       * increase the stock with given quantity of transaction.
       */
      if (!noStockFoundFromTransactions)
        totalTransactions = skuTransactions
          .map((tx: Transaction) => {
            if (tx.type == "order") return tx.qty;
            else return tx.qty * -1;
          })
          .reduce((prev: number, next: number) => prev + next);

      if (initialStockNotFound && noStockFoundFromTransactions)
        reject("NOT_FOUND");
      else {
        let totalStock = totalOldStock + totalTransactions;
        resolve({ sku, qty: totalStock });
      }
    } catch (error) {
      reject("Unknown_ERROR");
    }
  });
};

/**
 * Reading file synchronously!
 * Then parsing data to get the json data.
 * @param {*} filePath
 * @returns json
 */
export const getJsonFileContent = (filePath: string) => {
  try {
    let content = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
    return JSON.parse(content);
  } catch (error) {
    throw "FILE_NOT_FOUND";
  }
};
