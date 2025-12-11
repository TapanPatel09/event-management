/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menubar } from "primereact/menubar";
import { Avatar } from "primereact/avatar";
import { MenuItem } from "primereact/menuitem";
import { useNavigate } from "react-router";
import ContactCard from "./Contactcard";

// Extend the MenuItem type to include our custom properties
interface CustomMenuItem extends MenuItem {
  badge?: number;
  items?: CustomMenuItem[];
}

export default function TemplateDemo({ toggleSidebar }: any) {
  const navigate = useNavigate();

  const items: CustomMenuItem[] = [
    {
      icon: "pi pi-bars",
      command: () => {
        toggleSidebar();
      },
    },
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        navigate("/");
      },
    },
  ];

  const start = (
    <img
      onClick={() => {
        navigate("/");
      }}
      alt="logo"
      src="https://drive.google.com/thumbnail?id=1DYSJN9HV-DOlYzpWN7QAkOGH3_Wz6QTg&sz=w1000"
      className="h-[35px] ml-1 mr-1 hover:cursor-pointer"
    />
  );

  const end = (
    <div className="flex align-items-center gap-2 group">
      <div className="hidden group-hover:block">
        <ContactCard />
      </div>  
      <Avatar
        className="hover:cursor-pointer"
        image="https://uploads-ssl.webflow.com/647c2797a041413036e8e6fd/647d8981865d5dee2d03896e_Daco_5511364.png"
        shape="circle"
      />
    </div>
  );

  return (
    <div className="card pl-4 pr-4">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
