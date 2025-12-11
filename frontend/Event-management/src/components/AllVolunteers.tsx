import { Toolbar } from "primereact/toolbar";
import EventLayout from "../layout/EventLayout";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { useParams } from "react-router";
import { api, useFetchVolunteerByEventID } from "../Queries/Allquery";
import { ProgressSpinner } from "primereact/progressspinner";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import axios from "axios"; // Assuming you're using axios for API calls
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import "../css/parti.css"

// Updated interface to match the actual data structure
interface VolunteerEvent {
  event: string;
  role: string;
  _id: string;
  assignedTasks: string;
}

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  events: VolunteerEvent[];
}

const AllVolunteers = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null
  );

  const { eventId } = useParams<{ eventId: string }>();
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [selectedParticipants, setSelectedParticipants] = useState<
    Volunteer[] | null
  >(null);
  const [role, setrole] = useState<VolunteerEvent | null>(null);
  const [editingTasks, setEditingTasks] = useState<Record<string, string>>({});
  const toast = useRef<Toast>(null);

  const {
    data: volunteerResponse,
    isLoading,
    error,
    refetch,
  } = useFetchVolunteerByEventID(eventId || "");

  const volunteers = volunteerResponse?.volunteers || [];

  const dt = useRef<DataTable<Volunteer[]>>(null);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const updateVolunteerTasks = async (volunteerId: string, tasks: string) => {
    try {
      const volunteer = volunteers.find(
        (v: { _id: string }) => v._id === volunteerId
      );
      const eventIndex = volunteer?.events.findIndex(
        (e: { event: string | undefined }) => e.event === eventId
      );

      if (volunteer && eventIndex !== undefined && eventIndex >= 0) {
        const formdata = {
          volunteerId: volunteer,
          eventId,
          assignedTasks: tasks.trim(),
        };
        await axios.post(`${api}/volunteer/edittask`, formdata);

        toast.current?.show({
          severity: "success",
          summary: "Tasks Updated",
          detail: `Tasks for ${volunteer.name} have been updated`,
          life: 3000,
        });

        refetch();
      }
    } catch (error) {
      console.error("Error updating tasks:", error);
      toast.current?.show({
        severity: "error",
        summary: "Update Failed",
        detail: "Failed to update tasks. Please try again.",
        life: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <EventLayout>
        <div className="flex justify-center items-center h-screen">
          <ProgressSpinner />
        </div>
      </EventLayout>
    );
  }

  if (error) {
    return (
      <EventLayout>
        <p className="text-red-500 text-center">Failed to load volunteers.</p>
      </EventLayout>
    );
  }

  const actionBodyTemplate = (rowData: Volunteer) => {
    return (
      <div className="flex space-x-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-outlined"
          onClick={() => {
            setVisible(true);
            setSelectedVolunteer(rowData);
            setrole(rowData.events[0]);
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-outlined"
          onClick={async () => {
            try {
              const res = await axios.delete(
                `${api}/volunteer/delete/${rowData._id}/${eventId}`
              );
              if (res.status) {
                refetch();
                console.log(true);
              }
            } catch (error) {
              console.log(error);
            }

            console.log("Delete", rowData);
          }}
        />
      </div>
    );
  };

  const tasksBodyTemplate = (rowData: Volunteer) => {
    const event =
      rowData.events?.find((e) => e.event === eventId) || rowData.events[0];
    const volunteerId = rowData._id;

    // Get current tasks as a string
    const currentTasks = event?.assignedTasks || "";

    return (
      <InputText
        value={
          editingTasks[volunteerId] !== undefined
            ? editingTasks[volunteerId]
            : currentTasks
        }
        onChange={(e) =>
          setEditingTasks({ ...editingTasks, [volunteerId]: e.target.value })
        }
        onBlur={() => {
          if (editingTasks[volunteerId] !== undefined) {
            updateVolunteerTasks(volunteerId, editingTasks[volunteerId]);
          }
        }}
        placeholder="Add tasks"
        className="w-full p-2 border rounded"
      />
    );
  };

  const header = (
    <div className="flex justify-between items-center">
      <h4 className="m-0">Manage Volunteers</h4>
      <InputText
        className="border px-4 py-2"
        type="search"
        placeholder="🔍 Search"
        value={globalFilterValue}
        onChange={(e) => setGlobalFilterValue(e.target.value)}
      />
    </div>
  );

  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={async () => {
          const formdata = {
            volunteerId: selectedVolunteer?._id,
            eventId: eventId,
            name: selectedVolunteer?.name,
            email: selectedVolunteer?.email,
            phone: selectedVolunteer?.phone,
            role: role?.role,
          };
          console.log(formdata);

          try {
            await axios.post(`${api}/volunteer/edittask`, formdata);
            toast.current?.show({
              severity: "success",
              summary: "Tasks Updated",
              detail: `Tasks for ${formdata.name} have been updated`,
              life: 3000,
            });

            refetch();
          } catch (error) {
            console.error("Error updating tasks:", error);
            toast.current?.show({
              severity: "error",
              summary: "Update Failed",
              detail: "Failed to update tasks. Please try again.",
              life: 3000,
            });
          }
          setVisible(false);
        }}
        autoFocus
      />
    </div>
  );
  const cities = [
    "registration",
    "setup",
    "coordinator",
    "usher",
    "technical",
    "security",
    "general",
  ];

  return (
    <EventLayout>
      <Dialog
        header="Edit Volunteer Details"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        {selectedVolunteer && role && (
          <div className="space-y-4 p-4">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Name</label>
              <InputText
                value={selectedVolunteer.name}
                onChange={(e) =>
                  setSelectedVolunteer((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Email</label>
              <InputText
                type="email"
                value={selectedVolunteer.email}
                onChange={(e) =>
                  setSelectedVolunteer((prev) =>
                    prev ? { ...prev, email: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Phone</label>
              <InputText
                value={selectedVolunteer.phone}
                onChange={(e) =>
                  setSelectedVolunteer((prev) =>
                    prev ? { ...prev, phone: e.target.value } : null
                  )
                }
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-700 font-medium">Role</label>
              <Dropdown
                className="border rounded-lg px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={role?.role || ""}
                onChange={(e) => {
                  if (role) {
                    setrole({ ...role, role: e.target.value });
                  }
                }}
                options={cities}
                optionLabel="role"
                placeholder="Select a role"
              />
            </div>
          </div>
        )}
      </Dialog>

      <Toast ref={toast} />
      <div className="container p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold md:text-2xl pl-3">Volunteers</h2>

          <Toolbar
            right={() => (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportCSV}
                  className="p-button-info text-white bg-purple-500 hover:bg-purple-700 active:bg-purple-400 px-3 py-2 rounded"
                >
                  <i className="pi pi-upload mr-2 text-white"></i>
                  Export
                </button>
                <Button
                  label="Delete Selected"
                  icon="pi pi-trash"
                  className="p-button-danger bg-red-400 px-3 py-2 rounded"
                  onClick={() =>
                    console.log("Delete Selected", selectedParticipants)
                  }
                  disabled={!selectedParticipants?.length}
                />
              </div>
            )}
          />
        </div>

        <div className="overflow-auto">
          <DataTable className="table-one"
            ref={dt}
            value={volunteers}
            selection={selectedParticipants}
            onSelectionChange={(e) => setSelectedParticipants(e.value)}
            dataKey="_id"
            paginator
            selectionMode="multiple"
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            globalFilter={globalFilterValue}
            header={header}
            responsiveLayout="scroll"
          >
            <Column selectionMode="multiple" exportable={false} />

            <Column
              field="name"
              header="Name"
              sortable
              body={(rowData, options) =>
                `${options.rowIndex + 1}. ${rowData.name}`
              }
            />

            <Column field="email" header="Email" sortable />

            <Column field="phone" header="Phone" sortable />

            <Column
              field="events[0].role"
              header="Role"
              sortable
              body={(rowData) => {
                const event = rowData.events?.find(
                  (e: { event: string | undefined }) => e.event === eventId
                );
                return event?.role || rowData.events[0]?.role || "N/A";
              }}
            />

            <Column
              field="events[0].assignedTasks"
              header="Assigned Tasks"
              body={tasksBodyTemplate}
            />

            <Column body={actionBodyTemplate} header="Actions" />
          </DataTable>
        </div>
      </div>
    </EventLayout>
  );
};

export default AllVolunteers;
