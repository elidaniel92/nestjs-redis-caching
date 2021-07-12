import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
    @Prop({required: true})
    name: string;

    @Prop({required: true})
    quantityInStock: number;

    @Prop({required: true})
    buyPrice: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

