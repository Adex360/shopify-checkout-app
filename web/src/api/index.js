import { paymentCustomizationRoutes } from "./payment-customization-routes.js";
import { validationRoutes } from "./validation-routes.js";
import { customFieldsRoutes } from "./custom-fields-routes.js";
import { API_VERSION } from "../config/index.js";
import { publicRoutes } from "./public-routes.js";
import { cityListRoutes } from "./city-list-routes.js";
import { adminRoutes } from "./admin-routes.js";
import { planRoutes } from "./plan-routes.js";
import { confirmationRoutes } from "./confirmation-routes.js";
import { shopRoutes } from "./shop-routes.js";
const API_PREFIX = API_VERSION;

export const registerApi = (app) => {
  app.use(`${API_PREFIX}/shop`, shopRoutes);
  app.use(`${API_PREFIX}/payment-customization`, paymentCustomizationRoutes);
  app.use(`${API_PREFIX}/validation`, validationRoutes);
  app.use(`${API_PREFIX}/custom-fields`, customFieldsRoutes);
  app.use(`${API_PREFIX}/city-list`, cityListRoutes);
  app.use(`${API_PREFIX}/plan`, planRoutes);
};

export const registerClientApi = (app) => {
  app.use(`${API_PREFIX}`, publicRoutes);
  app.use("/api/admin", adminRoutes);
};

export const registerConfirmationApi = (app) => {
  app.use(`${API_PREFIX}/confirmation`, confirmationRoutes);
};
