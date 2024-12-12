'use strict';

var allRoles = [
  'superadmin',
  'backend',
  'executive-producer',
  'producer',
  'crew',
];

var isAllowedRole = function isAllowedRole(currentRole, targetRole) {
  var roleHierarchy = {
    superadmin: 0,
    backend: 1,
    'executive-producer': 2,
    producer: 3,
    crew: 4,
  };
  return roleHierarchy[currentRole] <= roleHierarchy[targetRole];
};

exports.getSameAndSubOrdinateRoles = function (currentUserRole) {
  return allRoles.filter(function (role) {
    return isAllowedRole(currentUserRole, role);
  });
};
