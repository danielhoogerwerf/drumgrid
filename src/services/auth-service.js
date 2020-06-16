import axios from "axios";

class AuthService {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
      withCredentials: true,
      validateStatus: () => true,
    });
  }

  signup = (username, password) => {
    return this.service.post("/api/auth/signup", { username, password }).then((response) => response.data);
  };

  login = (username, password) => {
    return this.service.post("/api/auth/login", { username, password }).then((response) => response.data);
  };

  logout = () => {
    return this.service.get("/api/auth/logout").then((response) => response.data);
  };

  isAuthenticated = () => {
    return this.service.get("/api/auth/isloggedin").then((response) => response.data);
  };
}

export default AuthService;
