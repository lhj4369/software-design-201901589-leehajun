/** 로그인·JWT에 사용하는 역할 */
const ROLES = {
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
};

const ROLE_LIST = [ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT];

module.exports = { ROLES, ROLE_LIST };
