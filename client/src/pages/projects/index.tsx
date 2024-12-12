import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

import Table from "@/components/table";
import Button from "@/components/button";
import Switch from "@/components/switch";
import createNotification from "@/common/create-notification";

import { Columns, TableActions } from "./component/columns";

import {
  deleteProjectById,
  getAllProject,
  handleUpdateProcessingStatus,
  updateProjectStatus,
} from "@/api-services/projects";

import { StatusInterface } from "./project-interface";
import { RowsInterface } from "@/interface/tables-interface";
import { ClientsStateInterface } from "@/interface/user-selector-interface";

import style from "./projects.module.scss";
import CreateUpdateProject from "../create-project/create-update-project";

const Projects: React.FC = () => {
  // const navigate = useNavigate();
  const { control, watch } = useForm();
  const { selectedClient } = useSelector((state: ClientsStateInterface) => state.clients);
  const [isDeleting, setIsDeleting] = useState<string>("");
  const [closedProjects, setClosedProjects] = useState<StatusInterface[]>([]);
  const [openedProjects, setOpenedProjects] = useState<StatusInterface[]>([]);
  const [projectLoading, setProjectLoading] = useState<boolean>(false);
  const [isCreateProject, setIsCreateProject] = useState<boolean>(false);
  const [incrementUpdatePage, setIncrementUpdatePage] = useState<number>(0);

  const getAllProjects = async () => {
    setProjectLoading(true);
    try {
      const res = await getAllProject({ selectedClient });
      if (res?.status === 200) {
        selectedClient &&
          setOpenedProjects(
            res.data.openedProjects
              ?.sort(
                (a: StatusInterface, b: StatusInterface) =>
                  a.createdAt &&
                  b.createdAt &&
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              )
              ?.filter(
                ({ clientId, isDeleted }: { clientId: string; isDeleted: boolean }) =>
                  clientId === selectedClient &&
                  (!isDeleted || isDeleted === null || isDeleted === undefined),
              ),
          );

        setClosedProjects(res.data.closedProjects);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProjectLoading(false);
    }
  };

  const handleDelete = async ({ _id }: { _id: string }) => {
    setIsDeleting(_id);
    try {
      const res = await deleteProjectById({ id: _id });
      if (res.status === 200) {
        getAllProjects();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting("");
    }
  };

  const handleProjectStatusClick = async ({
    projectStatus,
    row,
  }: {
    projectStatus: boolean;
    row: RowsInterface;
  }) => {
    const projectStatusResult = projectStatus ? "Closed" : "Opened";
    try {
      const res = await updateProjectStatus({
        id: row?._id,
        projectStatusResult,
      });

      if (res.status === 200) {
        (projectStatusResult === "Opened" ? setClosedProjects : setOpenedProjects)((prev) => {
          return [...prev.filter(({ _id }: { _id: string }) => _id !== row?._id)];
        });
        (projectStatusResult === "Opened" ? setOpenedProjects : setClosedProjects)(
          (prev: any[]) => {
            return [{ ...row, projectStatus }, ...prev];
          },
        );
      }
      createNotification("success", res?.data?.msg);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProcessingStatus = async ({ id }: { id: string }) => {
    try {
      const findIsProcessing = watch()[id]; // Get the boolean value from `watch()` by id
      const res = await handleUpdateProcessingStatus({ id, status: findIsProcessing });
      if (res.status === 200) {
        createNotification("success", res?.data?.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    selectedClient && getAllProjects();
  }, [selectedClient, incrementUpdatePage]);

  return (
    <div>
      <div className={style.projectBtn}>
        <div>
          <Switch
            control={control}
            name={"projectStatus"}
            defaultValue={true}
            title={watch("projectStatus") ? "Opened Project" : "Closed Project"}
          />
        </div>
        <Button
          title="Create Project"
          handleClick={() => {
            setIsCreateProject(true);
            // navigate("/create-project");
          }}
        />
      </div>
      {isCreateProject && (
        <CreateUpdateProject
          open={isCreateProject}
          handleModalClose={() => setIsCreateProject(false)}
          handleIncrementUpdatePage={() => setIncrementUpdatePage(incrementUpdatePage + 1)}
        />
      )}
      <Table
        columns={Columns({
          handleProcessingStatus,
          control,
        })}
        isLoading={projectLoading}
        rows={watch("projectStatus") ? openedProjects : closedProjects}
        actions={({ row }) => {
          return (
            <TableActions
              row={row}
              watch={watch}
              key={row?._id}
              isDeleting={isDeleting}
              handleDelete={({ _id }) => handleDelete({ _id })}
              handleProjectStatusClick={({ projectStatus, row }) =>
                handleProjectStatusClick({ projectStatus, row })
              }
            />
          );
        }}
      />
    </div>
  );
};

export default Projects;
