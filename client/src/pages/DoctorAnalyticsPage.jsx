import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../components/Card.jsx";
import { useApp } from "../context/AppContext.jsx";
import api, { withToken } from "../lib/api.js";

const toChartArray = (input) => Object.entries(input || {}).map(([name, value]) => ({ name, value }));

export default function DoctorAnalyticsPage() {
  const { auth } = useApp();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/doctor/analytics", withToken(auth.token)).then(({ data }) => setAnalytics(data.analytics));
  }, [auth]);

  if (!analytics) {
    return <Card title="Doctor analytics">Loading analytics...</Card>;
  }

  const metricCards = [
    { label: "Total Patients", value: analytics.totalPatients },
    { label: "Total Appointments", value: analytics.totalAppointments },
    { label: "Reports Generated", value: analytics.reportsGenerated },
    { label: "Active Patients", value: analytics.activePatients }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {metricCards.map((item) => (
          <Card key={item.label}>
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="mt-2 text-3xl font-semibold">{item.value}</div>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Disease trends">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={toChartArray(analytics.diseaseTrends)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0f766e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Severity distribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={toChartArray(analytics.severityDistribution)} dataKey="value" nameKey="name" outerRadius={90} fill="#115e59" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
