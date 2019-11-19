// puerto
process.env.PORT = process.env.PORT || 3000;

// env
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// db
let url;

if(process.env.NODE_ENV === 'dev'){
    url = "mongodb://localhost:27017/test";
}else{
    url = process.env.MONGO_URI;
}

process.env.URLDB = url;