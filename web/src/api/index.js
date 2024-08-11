import { paymentCustomizationRoutes } from "./payment-customization-routes.js";
import { validationRoutes } from "./validation-routes.js";
import { customFieldsRoutes } from "./custom-fields-routes.js";
import { API_VERSION } from "../config/index.js";
const API_PREFIX = API_VERSION;

export const registerApi = (app) => {
  //   app.use(`${API_PREFIX}/shop`, shopRoutes);
  app.use(`${API_PREFIX}/payment-customization`, paymentCustomizationRoutes);
  app.use(`${API_PREFIX}/validation`, validationRoutes);
  app.use(`${API_PREFIX}/custom-fields`, customFieldsRoutes);
};

// export const registerClientApi = (app) => {
//   app.use(`${API_PREFIX}`, publicRoutes);
//   app.use(`/api`, cloudRoute);
//   app.use('/api/admin', adminRoutes);
// };

// export const registerConfirmationApi = (app) => {
//   app.use(`${API_PREFIX}/confirmation`, confirmationRoutes);
// };
