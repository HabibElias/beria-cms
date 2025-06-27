import {
  RouterProvider
} from "react-router-dom";
import AuthProvider from "./components/auth-guard";
import { ThemeProvider } from "./components/theme-provider";
import routes from "./routes";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
