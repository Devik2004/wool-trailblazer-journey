import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Building, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

const COLORS = ["#A57F60", "#4F7942", "#7D5A50", "#8FBC8F", "#E5DCC5"];

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [processingFacilities, setProcessingFacilities] = useState<any[]>([]);
  const [farms, setFarms] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, facilitiesRes, farmsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/analytics-data/"),
          axios.get("http://localhost:8000/api/facilities-data/"),
          axios.get("http://localhost:8000/api/farms/"),
        ]);
        setAnalyticsData(analyticsRes.data);
        setProcessingFacilities(facilitiesRes.data);
        setFarms(farmsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  if (!analyticsData) return <div className="p-6">Loading...</div>;

  const statusDistributionData = Object.entries(
    analyticsData.statusDistribution
  ).map(([status, count]) => ({
    name: status,
    value: count as number,
  }));

  const facilityUtilizationData = processingFacilities.map((facility) => ({
    name: facility.name,
    utilization: facility.current_utilization,
    capacity: facility.capacity,
  }));

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-wool-darkBrown mb-4 md:mb-0">
          Supply Chain Partners
        </h1>
        <Button className="bg-wool-green hover:bg-wool-darkBrown text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Facility Utilization Chart */}
        <Card className="border-wool-beige">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-wool-brown" />
              <CardTitle>Partner Facilities</CardTitle>
            </div>
            <CardDescription>
              Our network of processing facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={facilityUtilizationData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10000]} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip
                    formatter={(value) => [`${value} kg`, "Utilization"]}
                    labelFormatter={() => "Facility Utilization"}
                  />
                  <Legend />
                  <Bar
                    dataKey="utilization"
                    name="Current Utilization (kg)"
                    fill="#A57F60"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Production by Farm Chart */}
        <Card className="border-wool-beige">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-wool-brown" />
              <CardTitle>Farm Production</CardTitle>
            </div>
            <CardDescription>
              Wool production volumes by farm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.productionByFarm}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="farmName" />
                  <YAxis
                    label={{
                      value: "kg",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} kg`, "Production"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="production"
                    name="Wool Production (kg)"
                    fill="#4F7942"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        {/* Status Distribution Pie Chart */}
        <Card className="border-wool-beige md:col-span-1">
          <CardHeader>
            <CardTitle>Batch Status Distribution</CardTitle>
            <CardDescription>
              Current status of wool batches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      percent > 0
                        ? `${name} ${(percent * 100).toFixed(0)}%`
                        : ""
                    }
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} batches`, "Count"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Facilities Table */}
        <Card className="border-wool-beige md:col-span-2">
          <CardHeader>
            <CardTitle>Processing Partners</CardTitle>
            <CardDescription>
              Details of our partner facilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity (kg)</TableHead>
                  <TableHead>Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processingFacilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell className="font-medium">
                      {facility.name}
                    </TableCell>
                    <TableCell>{facility.type}</TableCell>
                    <TableCell>{facility.location}</TableCell>
                    <TableCell>{facility.capacity}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full bg-wool-beige h-2 rounded-full overflow-hidden mr-2">
                          <div
                            className={`h-full ${
                              facility.current_utilization > 8000
                                ? "bg-red-500"
                                : facility.current_utilization > 6000
                                ? "bg-wool-brown"
                                : "bg-wool-green"
                            }`}
                            style={{
                              width: `${(facility.current_utilization /
                                facility.capacity) *
                                100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm">
                          {facility.current_utilization} kg
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Farms Table */}
      <Card className="border-wool-beige">
        <CardHeader>
          <CardTitle>Registered Farms</CardTitle>
          <CardDescription>
            Our network of premium wool producers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farm Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Sheep Count</TableHead>
                <TableHead>Annual Production (kg)</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Certifications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {farms.map((farm) => (
                <TableRow key={farm.id}>
                  <TableCell className="font-medium">{farm.name}</TableCell>
                  <TableCell>{farm.location}</TableCell>
                  <TableCell>{farm.sheep_count}</TableCell>
                  <TableCell>{farm.annual_production}</TableCell>
                  <TableCell>{farm.contact_person}</TableCell>
                  <TableCell>{farm.certifications.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
