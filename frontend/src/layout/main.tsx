import React from "react";
import Header from "./header";
// import Sidebar from "./sidebar";
// import Footer from "./footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {/* <Sidebar /> */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;