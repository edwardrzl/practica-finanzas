import express from "express";
import cors from "cors";
import categoriasRoutes from "./routes/categoriasRoutes.js";
//import pagosRoutes from "./routes/pagosRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categorias", categoriasRoutes);
//app.use("/api/vehiculo", vehiculoRoutes);

//app.use("/api/pagar", pagosRoutes);



app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});
