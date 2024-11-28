export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://admin.chechocutzz.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Credentials': 'true',
};
