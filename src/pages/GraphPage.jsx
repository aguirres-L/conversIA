import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const opcionesComunes = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { position: "bottom" },
  },
};

// Datos simulados: totales por tipo de conversación
const datosPorTipo = {
  labels: [
    "Completadas",
    "Sin responder (cliente)",
    "Sin responder (bot)",
  ],
  datasets: [
    {
      label: "Conversaciones",
      data: [24, 12, 5],
      backgroundColor: [
        "rgba(34, 197, 94, 0.8)",
        "rgba(234, 179, 8, 0.8)",
        "rgba(239, 68, 68, 0.8)",
      ],
      borderColor: [
        "rgb(34, 197, 94)",
        "rgb(234, 179, 8)",
        "rgb(239, 68, 68)",
      ],
      borderWidth: 1,
    },
  ],
};

// Gráfico circular: misma distribución
const datosDona = {
  labels: [
    "Completadas",
    "Sin responder (cliente)",
    "Sin responder (bot)",
  ],
  datasets: [
    {
      data: [24, 12, 5],
      backgroundColor: [
        "rgba(34, 197, 94, 0.8)",
        "rgba(234, 179, 8, 0.8)",
        "rgba(239, 68, 68, 0.8)",
      ],
      borderColor: ["rgb(34, 197, 94)", "rgb(234, 179, 8)", "rgb(239, 68, 68)"],
      borderWidth: 2,
    },
  ],
};

// Por mes: barras agrupadas
const datosPorMes = {
  labels: ["Ene", "Feb", "Mar", "Abr"],
  datasets: [
    {
      label: "Completadas",
      data: [8, 10, 6, 12],
      backgroundColor: "rgba(34, 197, 94, 0.8)",
    },
    {
      label: "Sin responder (cliente)",
      data: [4, 5, 3, 2],
      backgroundColor: "rgba(234, 179, 8, 0.8)",
    },
    {
      label: "Sin responder (bot)",
      data: [2, 1, 2, 1],
      backgroundColor: "rgba(239, 68, 68, 0.8)",
    },
  ],
};

const opcionesBarrasAgrupadas = {
  ...opcionesComunes,
  scales: {
    x: { stacked: false },
    y: { stacked: false, beginAtZero: true },
  },
};

export default function GraphPage() {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Estadísticas de conversaciones</h2>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700">
          Total por tipo
        </h3>
        <div className="h-64">
          <Bar
            data={datosPorTipo}
            options={{
              ...opcionesComunes,
              indexAxis: "y",
              scales: {
                x: { beginAtZero: true },
              },
            }}
          />
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700">
          Distribución (completadas vs sin responder)
        </h3>
        <div className="h-64 max-w-xs mx-auto">
          <Doughnut
            data={datosDona}
            options={{
              ...opcionesComunes,
              cutout: "60%",
            }}
          />
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-700">
          Por mes (completadas, sin responder cliente, sin responder bot)
        </h3>
        <div className="h-64">
          <Bar
            data={datosPorMes}
            options={opcionesBarrasAgrupadas}
          />
        </div>
      </section>
    </div>
  );
}
