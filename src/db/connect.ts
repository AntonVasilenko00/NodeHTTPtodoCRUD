import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()
async function connect() {
  const uri = `mongodb+srv://anton:${process.env.DB_PASSWORD}@cluster0.o5l5z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  console.log(process.env.DB_PASSWORD)
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect((err,db)=>{
      if(err) throw new Error(err.message)
      if(db){
        const todosDB = db.db('todosDB')
        // const todo = {text: 'some todo'}
        // todosDB.collection('todos').insertOne(todo, (err,res)=>{
        //   if(err) throw new Error(err.message)
        //   console.log('1 doc inserted')
        //   db.close()
        // })
        todosDB.collection('todos').findOne({},(err,res)=>{
          if(err) throw new Error(err.message)
          console.log(res!._id.toString())
        })
      }
    });

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}


export default connect
