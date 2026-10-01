import { Outlet } from "react-router-dom";

import Header from "../navigation/header";
import DesktopNavigation from "../navigation/desktop-navigation";
import MobileNavigation from "../navigation/mobile-navigation";

const PrivateLayout = () => {
  return (
    <div className="private-layout">
      <Header />

      <div className="private-layout__body">
        <aside className="private-layout__desktop-nav">
          <DesktopNavigation />
        </aside>

        <main className="private-layout__content">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default PrivateLayout;