import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const productDoc: ProductDocument = new this.productModel(createProductDto);
    return productDoc.save();     
  }

  /**
   * Calculate the total value (price) of all products in stock
   */
  async totalValueOfAllProductsInStock(): Promise<number> {
    const products = await this.productModel.find();
    return products.map((p) => { return p.quantityInStock * p.buyPrice }).reduce((acc, curr) => (acc + curr), 0);
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find();
  }

  findOne(id: number) {
    throw new NotImplementedException();
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    throw new NotImplementedException();
  }

  remove(id: number) {
    throw new NotImplementedException();
  }
}
