// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './20260403182255_fat_korvac.sql';
import m0001 from './20260404160536_closed_slipstream.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001
    }
  }
  