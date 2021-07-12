import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, CACHE_MANAGER, Inject, UseInterceptors, CacheTTL, CacheInterceptor } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { Product } from './entities/product.entity';
import { Cache } from 'cache-manager';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {   
    const createdProduct: Product = await this.productService.create(createProductDto);
    res.status(HttpStatus.CREATED).send();        
  }

  // Cache Implemention with Annotations
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get('total-value-of-all-products-in-stock')
  async totalValueOfAllProductsInStock() {
    return await this.productService.totalValueOfAllProductsInStock();
  }

  // Chache Implemention
  @Get('total-value-of-all-products-in-stock2')
  async totalValueOfAllProductsInStock2() {
    const cacheKey: string = '/product/total-value-of-all-products-in-stock2'
    const cachedData = await this.cacheManager.get(cacheKey);    
    if(cachedData) {
      console.log("Return Cached Data, key: " + cacheKey);
      return cachedData;
    } else {
      console.log("There is no cache.");
      const currentData: number = await this.productService.totalValueOfAllProductsInStock();
      console.log("Store in key " + cacheKey)
      this.cacheManager.set(cacheKey, currentData, { ttl: 30 });
      console.log("Return Current Data.")
      return currentData;
    }    
  }  

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':productid')
  findOne(@Param('productid') productid: string) {
    return this.productService.findOne(+productid);
  }

  @Put(':productid')
  update(@Param('productid') productid: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+productid, updateProductDto);
  }

  @Delete(':productid')
  remove(@Param('productid') productid: string) {
    return this.productService.remove(+productid);
  }
}
