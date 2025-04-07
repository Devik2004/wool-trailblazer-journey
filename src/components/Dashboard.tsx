import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Leaf, 
  Package, 
  Factory, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock
} from "lucide-react";
import { woolBatches, farms, processingFacilities, analyticsData } from "@/data/wool-data";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from "recharts";
import StatusUpdates from "./StatusUpdates";

const Dashboard = () => {
  // Colors for the pie chart
  const COLORS = ['#A57F60', '#4F7942', '#7D5A50', '#8FBC8F'];
  
  // Data for the pie chart
  const pieData = [
    { name: 'Fine', value: woolBatches.filter(batch => batch.grade === 'Fine').length },
    { name: 'Medium', value: woolBatches.filter(batch => batch.grade === 'Medium').length },
    { name: 'Coarse', value: woolBatches.filter(batch => batch.grade === 'Coarse').length },
    { name: 'Superfine', value: woolBatches.filter(batch => batch.grade === 'Superfine').length },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-wool-darkBrown">Wool Journey Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-wool-beige hover:bg-wool-beige">
            <Clock className="mr-2 h-4 w-4" />
            Last updated: Today
          </Button>
          <Button className="bg-wool-green hover:bg-wool-darkBrown text-white">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-wool-beige">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Farms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Leaf className="h-5 w-5 text-wool-darkBrown mr-2" />
              <div className="text-2xl font-bold">{farms.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-wool-beige">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-wool-brown mr-2" />
              <div className="text-2xl font-bold">{woolBatches.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-wool-beige">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Factory className="h-5 w-5 text-wool-green mr-2" />
              <div className="text-2xl font-bold">{processingFacilities.length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-wool-beige">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quality Score (Avg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-wool-lightGreen mr-2" />
              <div className="text-2xl font-bold">{analyticsData.averageQualityScore}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-wool-beige text-wool-brown mb-4">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="updates" className="data-[state=active]:bg-white">
            <Clock className="h-4 w-4 mr-2" />
            Recent Updates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-wool-beige">
              <CardHeader>
                <CardTitle>Monthly Production</CardTitle>
                <CardDescription>Wool production by month (kg)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.monthlyProduction}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#A57F60" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-wool-beige">
              <CardHeader>
                <CardTitle>Wool Grades Distribution</CardTitle>
                <CardDescription>Percentage by grade quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip />
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="updates" className="mt-0">
          <Card className="border-wool-beige">
            <CardHeader>
              <CardTitle>Recent Status Updates</CardTitle>
              <CardDescription>Latest activities across the supply chain</CardDescription>
            </CardHeader>
            <CardContent>
              <StatusUpdates />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
