import lowdb from 'lowdb';
import FileSync from "lowdb/adapters/FileSync.js";

const adapter = new FileSync('./src/database/conversation.json');
const db = lowdb(adapter);

db.defaults({ 
    conversations: [] 
}).write();

export default db;
