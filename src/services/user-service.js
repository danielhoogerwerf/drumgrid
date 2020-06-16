import axios from "axios";

class UserService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      withCredentials: true,
      validateStatus: () => true,
    });
  }

  changeUserName = (profile) => {
    return this.service.post("/api/profile/changeusername", { profile }).then((response) => response.data);
  };

  changePassword = (profile) => {
    return this.service.post("/api/profile/changePassword", { profile }).then((response) => response.data);
  };

  savePattern = (name, data) => {
    return this.service
      .post("/api/profile/savepattern", { name, data })
      .then((response) => response.data)
      .catch((error) => error);
  };

  updatePattern = (id, name, data) => {
    return this.service
      .put(`/api/profile/updatepattern/${id}`, { name, data })
      .then((response) => response.data)
      .catch((error) => error);
  };

  getPatterns = () => {
    return this.service
      .get("/api/profile/getpatterns")
      .then((response) => response.data)
      .catch((error) => error);
  };

  loadPattern = (patternId) => {
    return this.service.get(`/api/profile/loadpattern/${patternId}`).then((response) => response.data);
  };

  deletePattern = (patternId) => {
    return this.service.post(`/api/profile/delpattern/${patternId}`).then((response) => response.data);
  };
}

export default UserService;
