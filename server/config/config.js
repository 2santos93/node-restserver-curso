// puerto
process.env.PORT = process.env.PORT || 3000;

// env
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// client id google
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "91229116128-39mh6cu404un3imuhs8q9jqqvpp1pn9o.apps.googleusercontent.com";

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