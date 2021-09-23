import * as METHODS from "./main";

test("provide current stocks for given correct sku with mock data", async () => {
  jest
    .spyOn(METHODS, "getJsonFileContent")
    .mockImplementation((filePath: string) => {
      if (filePath.indexOf("stock") >= 0)
        return [
          { sku: "CLQ274846/07/46", stock: 8414 },
          { sku: "LTV719449/39/39", stock: 8525 },
          { sku: "SXB930757/87/87", stock: 3552 },
        ];
      else
        return [
          { sku: "LTV719449/39/39", type: "refund", qty: 10 },
          { sku: "DDB197432/70/91", type: "order", qty: 2 },
          { sku: "APM103457/39/27", type: "order", qty: 7 },
          { sku: "CPF246874/77/33", type: "order", qty: 8 },
        ];
    });
  let sku = "LTV719449/39/39";
  let response = await METHODS.calculateStockLevel(sku);
  expect(response).toMatchObject({ sku, qty: 8515 });
});

test("provide current stocks for given correct sku with mock data", async () => {
  jest.spyOn(METHODS, "getJsonFileContent").mockImplementation(() => {
    throw "FILE_NOT_FOUND";
  });
  let sku = "LTV719449/39/39",
    response;
  try {
    response = await METHODS.calculateStockLevel(sku);
  } catch (error) {
    response = error;
  }
  expect(response).toMatch("Unknown_ERROR");
});
