// module.exports = {
//   app: {
//     name: 'Mern Social Media',
//     apiEndpoint: process.env.API_URL ? `${process.env.API_URL}` : 'api',
//   },
//   database: {
//     // after the pipes will be your connection string for MongoDB Atlas which you can get from pressing connect on your collection and then clicking connect to application
//     url: process.env.MONGODB_URI || `mongodb+srv://abbey:mongoatlas@cluster0.ruv8gha.mongodb.net/kenziecart?retryWrites=true&w=majority`,
//   },
//   jwt: {
//     secret: process.env.JWT_SECRET || 'jwt-secret',
//     tokenLife: '7d',
//   },
// }



export const app = {
  name: "Mern Social Media",
  apiEndpoint: process.env.API_URL ? `/${process.env.API_URL}` : "/api",
};

export const database = {
  // after the pipes will be your connection string for MongoDB Atlas which you can get from pressing connect on your collection and then clicking connect to application
  url: process.env.MONGODB_URI ||
    `mongodb+srv://abbey:mongoatlas@cluster0.ruv8gha.mongodb.net/kenziecart?retryWrites=true&w=majority`,
};
export const jwt = {
  secret: process.env.JWT_SECRET || "jwt-secret",
  tokenLife: "7d",
};

const keys = { app, database, jwt }

export default keys
