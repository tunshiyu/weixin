const db = require('../db');
const crawler = require('./crawler');
const save = require('./save');

(async () => {
    const movies = await crawler();
    await db;
    // const movies = [];
    await save(movies);
})()
