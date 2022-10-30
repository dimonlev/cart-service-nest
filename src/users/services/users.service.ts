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

@Injectable()
export class UsersService {
  constructor() {}

  async findOne(user: User) {
    const client = new Client(dbOptions);
    await client.connect();

    try {
      const { name, email } = user;
      const { rows: data } = await client.query(
        `SELECT * FROM users WHERE users.name='${name} and users.email=${email}'`,
      );

      return data;
    } catch (err) {
      throw new Error(err);
    } finally {
      client.end();
    }
  }

  async createOne(user: User) {
    const client = new Client(dbOptions);
    await client.connect();
    try {
      const { name, email, password } = user;
      await client.connect();
      await client.query(`BEGIN`);
      const userToCreate = [name, email, password];
      console.log(userToCreate);
      const insertUser =
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id';
      const { rows: userData } = await client.query(insertUser, userToCreate);
      await client.query(`COMMIT`);
      const { rows: data } = await client.query(
        `SELECT * FROM users where users.id='${userData[0].id}'`,
      );
      return data[0];
    } catch (err) {
      throw new Error(err);
    } finally {
      client.end();
    }
    // console.log('this.PG_DATABASE: ', process.env.PG_DATABASE);
    // const createUserQuery = `INSERT into `;
    // const id = v4(v4());
    // const newUser = { id: name || id, name, password };

    // this.users[id] = newUser;

    // return newUser;
  }
}
