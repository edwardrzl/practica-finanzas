import express from "express";
import cors from "cors";
import categoriasRoutes from "./routes/categoriasRoutes";
import cuentasRoutes from "./routes/cuentasRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categorias", categoriasRoutes);
app.use("/api/cuentas", cuentasRoutes);

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});
