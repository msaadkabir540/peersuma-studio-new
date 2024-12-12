const allRoles = [
  'superadmin',
  'backend',
  'executive-producer',
  'producer',
  'crew',
];

const isAllowedRole = (currentRole, targetRole) => {
  const roleHierarchy = {
    superadmin: 0,
    backend: 1,
    'executive-producer': 2,
    producer: 3,
    crew: 4,
  };

  return roleHierarchy[currentRole] <= roleHierarchy[targetRole];
};

exports.getSameAndSubOrdinateRoles = (currentUserRole) =>
  allRoles.filter((role) => isAllowedRole(currentUserRole, role));
