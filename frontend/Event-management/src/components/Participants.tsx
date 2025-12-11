/* eslint-disable @typescript-eslint/no-explicit-any */
import "../css/parti.css";
import { useParams } from "react-router-dom";
import EventLayout from "../layout/EventLayout";
import {
  useDeleteParticipant,
  useEditParticipant,
  useFetchParticipantsByEventId,
} from "../Queries/Allquery";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "../css/Participant.css";
import { Dialog } from "primereact/dialog";
import { useQueryClient } from "@tanstack/react-query";

interface Participant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  paymentStatus: string;
}

const Participants = () => {
  const queryClient = useQueryClient();
  const { eventId }: any = useParams<{ eventId: string }>();

  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useFetchParticipantsByEventId(eventId);
  const { mutate: EditParticipant } = useEditParticipant();
  const { mutate: DeleteParticipant } = useDeleteParticipant();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [editParticipant, setEditParticipant] = useState<Participant | null>(
    null
  );

  const [selectedParticipants, setSelectedParticipants] = useState<
    Participant[]
  >([]);
  const dt = useRef<DataTable<Participant[]>>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (event?.participants) {
      setParticipants(event.participants);
    }
  }, [event]);

  const handleDelete = (participant: Participant) => {
    confirmDialog({
      message: "Are you sure you want to delete this participant?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        DeleteParticipant(
          { userids: [participant._id] },
          {
            onSuccess: () => {
              refetch();
              queryClient.invalidateQueries({
                queryKey: ["participants", eventId ?? ""],
              });
              toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Participant deleted successfully",
                life: 3000,
              });
            },
            onError: (error) => {
              console.error("Error deleting participant:", error);
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete participant",
                life: 3000,
              });
            },
          }
        );
      },
    });
  };

  const handleEdit = (participant: Participant) => {
    setEditParticipant({ ...participant });
    setVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editParticipant) {
      setEditParticipant({
        ...editParticipant,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleConfirmEdit = () => {
    console.log(editParticipant);

    if (editParticipant) {
      EditParticipant(editParticipant, {
        onSuccess: () => {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Participant updated successfully",
            life: 3000,
          });

          setParticipants((prev) =>
            prev.map((p) =>
              p._id === editParticipant._id ? editParticipant : p
            )
          );
          setVisible(false);
        },
      });
    }
  };

  const handleDeleteSelected = () => {
    confirmDialog({
      message: "Are you sure you want to delete the selected participants?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        DeleteParticipant(
          { userids: selectedParticipants },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["participants", eventId ?? ""],
              });
              toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Selected participants deleted successfully",
                life: 3000,
              });
              setSelectedParticipants([]);
            },
          }
        );
      },
    });
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
        <p className="text-red-500 text-center">Failed to load participants.</p>
      </EventLayout>
    );
  }

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const actionBodyTemplate = (rowData: Participant) => {
    return (
      <div className="flex space-x-2">
        <Button
        style={{borderRadius:"50%"}}
          icon="pi pi-pencil"
          className="border-2 p-button-success p-button-outlined"
          onClick={() => handleEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-outlined"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex justify-between items-center">
      <h4 className="m-0">Manage Participants</h4>

      <InputText
        className="border px-4 py-2"
        type="search"
        placeholder="🔍 Search"
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
    </div>
  );

  return (
    <EventLayout>
      <div className="container min-h-screen rounded-xl  p-4">
        <Toast ref={toast} />
        <ConfirmDialog />

        <Dialog
          header="Edit Participant"
          visible={visible}
          className="w-full sm:w-[90vw] md:w-[70vw] lg:w-[50vw]"
          onHide={() => setVisible(false)}
          footer={
            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={() => setVisible(false)}
                className="bg-red-600 text-white  p-2 rounded-md "
              >
                Cancel
              </button>
              <button
                className="bg-blue-600  text-white p-2 rounded-md active:bg-blue-400"
                onClick={handleConfirmEdit}
              >
                Save
              </button>
            </div>
          }
        >
          <div className="p-fluid space-y-2">
            <InputText
              className="mt-1 p-2 block w-full rounded-md border-2"
              name="name"
              value={editParticipant?.name || ""}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <InputText
              className="mt-1 p-2 block w-full rounded-md border-2"
              name="email"
              value={editParticipant?.email || ""}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <InputText
              className="mt-1 p-2 block w-full rounded-md border-2"
              name="phone"
              value={editParticipant?.phone || ""}
              onChange={handleInputChange}
              placeholder="Phone"
            />
          </div>
        </Dialog>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold md:text-2xl pl-3">
            Participants of {event?.title || "Event"}
          </h2>

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
                  onClick={handleDeleteSelected}
                  disabled={!selectedParticipants.length}
                />
              </div>
            )}
          />
        </div>

        <div className="overflow-auto">
          <DataTable
            className="table-one"
            responsive-layout="stack"
            breakpoint="960px"
            ref={dt}
            value={participants}
            selection={selectedParticipants}
            onSelectionChange={(e) => setSelectedParticipants(e.value)}
            dataKey="_id"
            paginator
            selectionMode="multiple"
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            globalFilter={globalFilter}
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
            <Column field="paymentStatus" header="Payment Status" sortable />
            <Column body={actionBodyTemplate} header="Actions" />
          </DataTable>
        </div>
      </div>
    </EventLayout>
  );
};

export default Participants;
