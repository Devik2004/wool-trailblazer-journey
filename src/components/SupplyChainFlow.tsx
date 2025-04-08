import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scissors,
  FilterX,
  Droplets,
  Cog,
  Combine,
  Paintbrush,
  Shirt,
  PackageCheck,
  Truck,
  ArrowRight,
} from "lucide-react";
import api from "@/services/apiService";

// Map status to icon
const statusIcons = {
  Sheared: <Scissors className="h-6 w-6" />,
  Sorted: <FilterX className="h-6 w-6" />,
  Cleaned: <Droplets className="h-6 w-6" />,
  Processed: <Cog className="h-6 w-6" />,
  Spun: <Combine className="h-6 w-6" />,
  Dyed: <Paintbrush className="h-6 w-6" />,
  Woven: <Shirt className="h-6 w-6" />,
  Finished: <PackageCheck className="h-6 w-6" />,
  Delivered: <Truck className="h-6 w-6" />,
};

const statusColors = {
  Sheared: "bg-wool-beige text-wool-darkBrown",
  Sorted: "bg-wool-beige text-wool-darkBrown",
  Cleaned: "bg-wool-beige text-wool-darkBrown",
  Processed: "bg-wool-brown text-white",
  Spun: "bg-wool-brown text-white",
  Dyed: "bg-wool-brown text-white",
  Woven: "bg-wool-darkBrown text-white",
  Finished: "bg-wool-darkBrown text-white",
  Delivered: "bg-wool-green text-white",
};

const SupplyChainFlow = () => {
  const { data: woolBatches = [] } = useQuery({
    queryKey: ["woolBatches"],
    queryFn: () => api.batches.getAllBatches(),
  });

  const { data: processingFacilities = [] } = useQuery({
    queryKey: ["processingFacilities"],
    queryFn: () => api.facilities.getAllFacilities(),
  });

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-wool-darkBrown mb-6">
        Supply Chain Flow
      </h1>

      <Card className="border-wool-beige mb-8">
        <CardHeader>
          <CardTitle>Process Overview</CardTitle>
          <CardDescription>
            The journey of wool from farm to finished product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between min-w-max py-4 relative">
              {Object.entries(statusIcons).map(([status, icon], index) => (
                <div key={status} className="flex flex-col items-center mx-4">
                  <div
                    className={`rounded-full p-4 ${
                      index < 3
                        ? "bg-wool-beige"
                        : index < 6
                        ? "bg-wool-brown"
                        : "bg-wool-darkBrown"
                    } text-white`}
                  >
                    {icon}
                  </div>
                  <span className="mt-2 text-sm font-medium text-wool-darkBrown">
                    {status}
                  </span>
                  {index < Object.entries(statusIcons).length - 1 && (
                    <ArrowRight className="absolute ml-16 text-wool-gray" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Wool Batches */}
        <Card className="border-wool-beige">
          <CardHeader>
            <CardTitle>Active Wool Batches</CardTitle>
            <CardDescription>
              Current status of wool batches in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {woolBatches.map((batch) => {
                const totalSteps = 9;
                const currentStepIndex =
                  Object.keys(statusIcons).indexOf(batch.current_status);
                const progressPercentage = Math.round(
                  ((currentStepIndex + 1) / totalSteps) * 100
                );

                return (
                  <div key={batch.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        {batch.id.replace("batch-", "Batch ")}
                      </h3>
                      <Badge
                        className={
                          statusColors[batch.current_status] || "bg-wool-gray"
                        }
                      >
                        {batch.current_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                       {batch.weight}kg · {batch.grade} ·{" "}
                      {batch.color}
                    </p>
                    <div className="w-full bg-wool-beige h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-wool-brown"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Status at: {batch.current_status}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Facilities */}
        <Card className="border-wool-beige">
          <CardHeader>
            <CardTitle>Processing Facilities</CardTitle>
            <CardDescription>
              Current capacity and utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {processingFacilities.map((facility) => {
                const utilizationPercentage = facility.capacity
                  ? Math.min(
                      Math.round(
                        (facility.current_utilization / facility.capacity) * 100
                      ),
                      100
                    )
                  : 0;

                const barColor =
                  utilizationPercentage > 80
                    ? "bg-red-500"
                    : utilizationPercentage > 60
                    ? "bg-wool-brown"
                    : "bg-wool-green";

                return (
                  <div key={facility.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{facility.name}</h3>
                      <Badge className="bg-wool-green text-white">
                        {facility.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {facility.location} · Capacity: {facility.capacity}kg
                    </p>
                    <div className="w-full bg-wool-beige h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor}`}
                        style={{ width: `${utilizationPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Utilization: {utilizationPercentage}%
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplyChainFlow;
