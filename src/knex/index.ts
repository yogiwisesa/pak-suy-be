import Knex from 'knex';
import config from './knexfile';

const environment = process.env.NODE_ENV || 'development';

// eslint-disable-next-line
//@ts-ignore
const knex = Knex(config[environment]);

async function connectDB() {
  /* eslint-disable no-await-in-loop */

  let retries = 3;

  while (retries) {
    try {
      await knex.raw('select 1+1 as result');
      console.log('Connection success'); // eslint-disable-line
      break;
    } catch (error) {
      console.error("Couldn't connect to DB: ", error); // eslint-disable-line

      retries -= 1;
      console.log(`retries left: ${retries}`); // eslint-disable-line

      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

connectDB();

export default knex;
