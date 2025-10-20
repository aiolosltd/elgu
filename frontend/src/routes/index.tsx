import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import VerifyPage from "@/pages/Auth/VerifyPage";
import DashboardPage from "@/pages/Dashboard/Summary/DashboardPage";
import BusinessLists from "@/pages/Dashboard/Business/BusinessList";
import BusinessForm from "@/pages/Dashboard/Business/businessForm";
import WeatherPages from "@/pages/Dashboard/Summary/WeatherPages";
import Error from "@/pages/Error";
import GISmain from "@/pages/Dashboard/Maps/GISMain";
import Maps from "@/pages/Dashboard/Maps/Maps";
import MainLayout from "@/layout/main";
import { FormProvider } from "@/context/FormContext";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <DashboardPage />
      </MainLayout>
    ),
  },

  {
    path: "/dashboard-summary",
    element: (
      <MainLayout>
        <WeatherPages />
      </MainLayout>
    ),
  },

  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify",
    element: <VerifyPage />,
  },

  {
    path: "/dashboard",
    element: (
      <MainLayout>
        <DashboardPage />
      </MainLayout>
    ),
  },

  {
    path: "/business-lists",

    element: (
      <MainLayout>
        <BusinessLists />
      </MainLayout>
    ),
  },

  {
    path: "/business-form",

    element: (
      <MainLayout>
        <FormProvider>
          <BusinessForm />
        </FormProvider>
      </MainLayout>
    ),
  },

  {
    path: "/satelite-map",
    element: (
      <MainLayout>
        <GISmain />
      </MainLayout>
    ),
  },

  {
    path: "/Maps",
    element: (
      <MainLayout>
        <Maps />
      </MainLayout>
    ),
  },

  {
    path: "/calendar",
    element: (
      <MainLayout>
        <Error />
      </MainLayout>
    ),
  },

  {
    path: "*",
    element: (
      <MainLayout>
        <Error />
      </MainLayout>
    ),
  },
]);
