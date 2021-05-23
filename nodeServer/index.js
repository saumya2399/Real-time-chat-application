//node server which will handle socket io connections
const mongo=require('mongodb').MongoClient;
const io=require('socket.io')(8000);

const users={};

//connect to mongodb
mongo.connect('mongodb://127.0.0.1/app',function(err,db){
  if(err){
    throw err;
  }
  console.log('MongoDB connected');


//connect to socket.io
io.on('connection',socket=>{
    socket.on('new-user-joined',name=>{
       console.log("new user",name);
       users[socket.id]=name;
       socket.broadcast.emit('user-joined',name);
    });

    socket.on('send',message=>{
      socket.broadcast.emit('receive',{message: message,name:users[socket.id]})
    });

    socket.on('disconnect',message=>{
      socket.broadcast.emit('leave',users[socket.id]);
      delete users[socket.id];
    });
})

});
