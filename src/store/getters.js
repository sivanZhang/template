export default {
  sidebar: state => state.app.sidebar,
  token: state => state.login.token,
  avatar: state => state.login.avatar,
  name: state => state.login.name,
  roles: state => state.login.roles,
  permission_routes: state => state.permission.routes,
  permissions: state => state.login.permissions
};
