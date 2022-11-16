import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Client } from 'pg';
import { Order } from '../models';
import { CartItem } from 'src/cart';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';

const { PG_HOST, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: 5432,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};
const client = new Client(dbOptions);
client.connect();

@Injectable()
export class OrderService {
  private orders: Record<string, Order> = {};

  findById(orderId: string): Order {
    return this.orders[orderId];
  }

  async getById() {
    try {
      const query = `select o.id as order_id , o.user_id, o.payment, o.delivery, o."comments" , o.status , o.total , p.id as product_id, p.title, p.description, p.price, ci.count  from orders o join users u 
      on o.user_id = u.id 
      join carts c 
      on c.id  = o.cart_id 
      join cart_items ci 
      on ci.cart_id = c.id 
      join stocks s 
      on ci.product_id = s.product_id 
      join products p 
      on p.id = ci.product_id 
        where o.user_id = 'e54c1f44-4af3-467b-8ce1-1cab704c6a28' 
          and status = 'delivered'`;
      const { rows: data } = await client.query(query);
      const items: CartItem[] = [];
      let result = {};
      for (const row of data) {
        const item: CartItem = {
          product: {
            id: row.product_id,
            description: row.description,
            title: row.title,
            price: row.price,
          },
          count: row.count,
        };
        items.push(item);
        result = {
          id: row.id,
          userId: row.user_id,
          cartId: row.cart_id,
          payment: row.payment,
          delivery: row.delivery,
          comments: row.comments,
          status: row.status,
          total: row.total,
        };
      }
      return {
        ...result,
        items,
      };
    } catch (err) {
      console.log(err);
    }
  }

  create(data: any) {
    const id = v4(v4());
    const order = {
      ...data,
      id,
      status: 'inProgress',
    };

    this.orders[id] = order;

    return order;
  }

  update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orders[orderId] = {
      ...data,
      id: orderId,
    };
  }
}
