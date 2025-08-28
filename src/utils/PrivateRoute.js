import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const PrivateRoute = ({element}) => {
  const { user } = useUser();
  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;