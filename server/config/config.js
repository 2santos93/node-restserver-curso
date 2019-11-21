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

// expire token
process.env.EXPIRE_TOKEN = 60 * 60 * 24 * 30;

// seed token
process.env.SEED_TOKEN = process.env.SEED_TOKEN || "GokuEsMIdios";