import { useContext } from "react";

import { Snackbar, Alert } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ToastContext } from "./components/Context.jsx/ToastContext";

function Layout() {
  const { toast, setToast } = useContext(ToastContext);

  return (
    <>
      <Snackbar
        open={toast?.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast?.severity}
          variant="filled"
        >
          {toast?.message}
        </Alert>
      </Snackbar>

      <Outlet />
    </>
  );
}

export default Layout;