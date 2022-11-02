import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { User } from '../models';

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
export class UsersService {
  private readonly users: Record<string, User>;
  constructor() {
    this.users = {};
  }

  findOne(userId: string): User {
    return this.users[userId];
  }

  async findOneUser(name: string, password: string) {
    try {
      const { rows: data } = await client.query(
        `SELECT * FROM users WHERE users.name='${name} and users.password=${password}'`,
      );
      console.log('findOneUser data[0]: ', data[0]);
      return data[0];
    } catch (err) {
      throw new Error(err);
    } finally {
      // client.end();
    }
  }

  async createOne(user: User) {
    try {
      const { name, email, password } = user;
      await client.query(`BEGIN`);
      const userToCreate = [name, email, password];
      console.log('createOne userToCreate: ', userToCreate);
      const insertUser =
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id';
      const { rows: userData } = await client.query(insertUser, userToCreate);
      await client.query(`COMMIT`);
      const { rows: data } = await client.query(
        `SELECT * FROM users where users.id='${userData[0].id}'`,
      );
      console.log('createOne data: ', data);
      return data[0];
    } catch (err) {
      throw new Error(err);
    } finally {
      // client.end();
    }
  }
}
