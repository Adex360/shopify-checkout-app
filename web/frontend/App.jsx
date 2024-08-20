import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import "./App.css";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import { AppContextProvider } from "./context";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <AppContextProvider>
            <QueryProvider>
              <NavigationMenu
                navigationLinks={[
                  {
                    label: "Payment Customization",
                    destination: "/payment",
                  },
                  // {
                  //   label: "Checkout City List ",
                  //   destination: "/checkout-city",
                  // },
                  {
                    label: "Phone Validation",
                    destination: "/phone-validation",
                  },
                  {
                    label: "Custom Fields",
                    destination: "/custom-fields",
                  },
                  {
                    label: "Checkout Info Banner",
                    destination: "/checkout-info-banner",
                  },
                  {
                    label: "Plans",
                    destination: "/plans",
                  },
                ]}
              />
              <Routes pages={pages} />
            </QueryProvider>
          </AppContextProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
