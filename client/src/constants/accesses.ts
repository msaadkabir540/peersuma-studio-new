// roles.ts

type SuperadminRoleType = [
  "admin",
  "backend",
  "producer",
  "add_client",
  "change_client",
  "get_all_albums",
  "get_all_library",
  "get_all_projects",
  "get_all_templates",
  "get_all_media_library",
];

type BackendRoleType = [
  "backend",
  "producer",
  "add_client",
  "admin_backend",
  "change_client",
  "get_all_albums",
  "get_all_library",
  "get_all_projects",
  "get_all_templates",
  "get_all_media_library",
];

type ExecutiveProducerRoleType = [
  "producer",
  "get_all_albums",
  "get_all_library",
  "get_all_projects",
];

type ProducerRoleType = ["producer", "get_all_albums", "get_all_library", "get_all_projects"];

type CrewRoleType = ["get_all_albums"];

interface Roles {
  superadmin: SuperadminRoleType;
  backend: BackendRoleType;
  "executive-producer": ExecutiveProducerRoleType;
  producer: ProducerRoleType;
  crew: CrewRoleType;
}

const roles: Roles = {
  superadmin: [
    "admin",
    "backend",
    "producer",
    "add_client",
    "change_client",
    "get_all_albums",
    "get_all_library",
    "get_all_projects",
    "get_all_templates",
    "get_all_media_library",
  ],
  backend: [
    "backend",
    "producer",
    "add_client",
    "admin_backend",
    "change_client",
    "get_all_albums",
    "get_all_library",
    "get_all_projects",
    "get_all_templates",
    "get_all_media_library",
  ],
  "executive-producer": ["producer", "get_all_albums", "get_all_library", "get_all_projects"],
  producer: ["producer", "get_all_albums", "get_all_library", "get_all_projects"],
  crew: ["get_all_albums"],
};

export default roles;
