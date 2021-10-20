
export class Product {
  constructor(
    public productName: string,
    public productBrand: string,
    public url: string,
    public productDescription: string,
    public nutritionFacts: string,
    public supplierId: number,
    public unitCost: number = 0.00,
    public unitType: string,
    public supermarketName: string,
    public quantity: number = 0) {
  }

  checkID(productName: string, productBrand: string): boolean {
    return this.productName === productName && this.productBrand === productBrand;
  }
}
