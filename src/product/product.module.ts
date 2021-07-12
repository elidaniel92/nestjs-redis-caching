import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product.entity';
import { CacheModule } from 'node_modules/@nestjs/common/cache/cache.module';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),   
  CacheModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: 'localhost',
        port: '6379',
        ttl: 120
      }),
  }),
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}