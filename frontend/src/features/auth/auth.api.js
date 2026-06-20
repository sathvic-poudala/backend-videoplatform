import api from "../../api/axios";

export function loginUser(credentials) {
  return api.post("/users/login", credentials);
}

export function logoutUser() {
  return api.post("/users/logout");
}