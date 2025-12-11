import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(
    (state: { auth: { isAuthenticated: boolean; loading: boolean } }) =>
      state.auth
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export { PrivateRoute };

import { ReactNode } from "react";

interface PrivateRouteWrapperProps {
  children: ReactNode;
}

const PrivateRouteWrapper: React.FC<PrivateRouteWrapperProps> = ({
  children,
}) => {
  return <PrivateRoute>{children}</PrivateRoute>;
};

export { PrivateRouteWrapper };
