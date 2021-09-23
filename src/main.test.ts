import { calculateStockLevel } from "./main";

test("provide current stocks for given correct sku", async () => {
  let sku = "LRT321244/74/76";
  let response = await calculateStockLevel(sku);
  expect(response).toMatchObject({ sku, qty: 53 });
});

test("provide current stocks for given correct sku from transactions only, not present in initial stocks", async () => {
  let sku = "KSS894454/75/76";
  let response = await calculateStockLevel(sku);
  expect(response).toMatchObject({ sku, qty: 85 });
});

test("expects NOT_FOUND for given inCorrect sku", async () => {
  let sku = "WRONG_SKU",
    response;
  try {
    response = await calculateStockLevel(sku);
  } catch (error) {
    response = error;
  }
  await expect(response).toMatch("NOT_FOUND");
});
