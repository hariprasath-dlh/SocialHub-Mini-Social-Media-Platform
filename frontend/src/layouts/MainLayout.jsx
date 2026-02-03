import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ mt: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2 } }}>
        <Container maxWidth="md">
          <Outlet />
        </Container>
      </Box>
    </>
  );
};

export default MainLayout;
