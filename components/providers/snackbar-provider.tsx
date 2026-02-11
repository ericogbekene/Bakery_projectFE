"use client"

import { SnackbarProvider } from "notistack";
import { ReactNode } from "react";

const NotistackProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      {children}
    </SnackbarProvider>
  );
};

export default NotistackProvider;
