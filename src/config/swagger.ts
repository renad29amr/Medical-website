import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Medical Appointment API",
      version: "1.0.0",
      description:
        "API for patients, doctors, appointments, schedules, and admins",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [
    "./server.ts",
    "./src/routes/*.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);