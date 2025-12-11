import { PanelMenu } from "primereact/panelmenu";
import { MenuItem } from "primereact/menuitem";
import "../css/sidebar.css";
import { useNavigate } from "react-router";
interface SidebarProps {
  isExpanded: boolean;
}
export default function MultipleDemo({ isExpanded }: SidebarProps) {
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      label: "Dashboard ",
      icon: "pi pi-th-large",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "My Events",
      icon: "pi pi-folder-plus",
      command: () => {
        navigate("/events");
      },
    },
  ];
  return (
    <div
      className={`border border-gray-300 mt-4 ml-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out   ${
        isExpanded ? "w-64" : "w-16 p-2"
      }`}
    >
      {isExpanded ? (
        <PanelMenu model={items} className="w-full" />
      ) : (
        <div className="flex flex-col items-center space-y-6 mt-4">
          {items.map((item, index) => (
            <i
              key={index}
              className={`${item.icon} text-2xl cursor-pointer hover:text-blue-600 active:text-blue-400`}
              onClick={(e) =>
                item.command && item.command({ originalEvent: e, item })
              }
            ></i>
          ))}
        </div>
      )}
    </div>
  );
}
