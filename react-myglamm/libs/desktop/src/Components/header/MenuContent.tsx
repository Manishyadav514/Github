import React from "react";

import Widgets from "../home/Widgets";

const MenuContent = ({ data, widgets, closeMenu }: any) => (
  <div className={`menu-content flex justify-end ${data.class} w-full`}>
    {widgets && widgets.length > 0 && <Widgets widgets={widgets} cssClass={data} closeMenu={closeMenu} />}
  </div>
);

export default MenuContent;
