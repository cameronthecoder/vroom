const { generateZodSchemas } = require("kanel-zod");
require("path");

/** @type {import('kanel').Config} */
module.exports = {
    connection: {
        connectionString: "postgres://camerondahl@localhost:5432/vroom",
    },
  
    preDeleteOutputFolder: true,
    outputPath: "shared/types/zod/",
  
    customTypeMap: {
      "pg_catalog.tsvector": "string",
      "pg_catalog.bpchar": "string",
    },

    preRenderHooks: [generateZodSchemas],
  };