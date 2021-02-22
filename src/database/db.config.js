module.exports = {
  // Comment/uncomment wherever needed
  HOST: process.env.PGHOST || "172.21.148.168",
  USER: process.env.PGUSER || "admin",
  PASSWORD: process.env.PGPASSWORD || "ninecent",
  DB: process.env.PGDATABASE || "Ninecent_DB",
  PORT: process.env.PGPORT || 5432,
  // HOST: "localhost",
  // USER: "postgres",
  // PASSWORD: "irvin123",
  // DB: "Ninecent_Local",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
