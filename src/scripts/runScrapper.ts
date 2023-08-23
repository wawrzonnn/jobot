import yargs from 'yargs';
import { findOffers } from './findOffers';

const argv = yargs
  .options({
    's': {
      alias: 'search',
      describe: 'Search term for the job',
      type: 'string',
      default: 'frontend' 
    },
    'l': {
      alias: 'limit',
      describe: 'Limit the number of job offers',
      type: 'number',
      default: 10  
    }
  })
  .help()
  .alias('help', 'h')
  .parse(); 

findOffers(argv.search, argv.limit);