import axios from "../../api/axios";
import ENDPOINTS from "../../api/endpoints/Endpoints";

export const getUserApi = () => axios.get(ENDPOINTS.GET_USER);
export const endUserSessionApi = () => axios.get(ENDPOINTS.END_USER_SESSION);
