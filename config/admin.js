module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '08f905a90162e1f2bfc764021711f53b'),
  },
});
