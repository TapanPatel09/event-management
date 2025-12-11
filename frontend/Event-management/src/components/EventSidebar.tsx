import { PanelMenu } from "primereact/panelmenu";
import { MenuItem } from "primereact/menuitem";
import { useNavigate, useParams } from "react-router";
import "../css/sidebar.css";

interface SidebarProps {
  isExpanded: boolean;
}
export default function EventSidebar({ isExpanded }: SidebarProps) {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();

  const items: MenuItem[] = [
    {
      label: "My Event",
      icon: "pi pi-th-large",
      command: () => {
        if (eventId) {
          navigate(`/events/${eventId}`);
        } else {
          console.warn("Event ID not found in URL!");
        }
      },
    },
    {
      label: "Participants",
      icon: "pi pi-folder-plus",
      command: () => {
        if (eventId) {
          navigate(`/events/${eventId}/participants`);
        }
      },
    },
    {
      label: "Volunteers",
      icon: "pi pi-users",
      command: () => {
        if (eventId) {
          navigate(`/events/${eventId}/volunteers`);
        }
      },
    },
    {
      label: "Analytics",
      icon: "pi pi-chart-line",
      command: () => {
        if (eventId) {
          navigate(`/events/${eventId}/analytics`);
        }
      },
    },
    {
      label: "Promotions",
      icon: "pi pi-megaphone",
      command: () => {
        if (eventId) {
          navigate(`/events/${eventId}/promotions`);
        }
      },
    },
    {
      label: "Q&A",
      icon: "pi pi-comments",
      command: () => {
        if (eventId) {
          navigate(`/events/${eventId}/qa`);
        }
      },
    },
  ];

  return (
    <div
      className={`border border-gray-300  mt-3 ml-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out   ${
        isExpanded ? "w-64" : "w-16 p-2"
      }`}
    >
      {isExpanded ? (
        <PanelMenu model={items} className="w-full border-r rounded-md" />
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
      {/* <PanelMenu
        model={items}
        className="w-72 bg-gray-100 border-r rounded-md"
      /> */}
    </div>
  );
}
