import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Leaf,
  ShieldCheck,
  User,
  Mail,
  CalendarDays,
  Scissors,
} from "lucide-react";
import NewFarmDialog from "./NewFarmDialog";
import api from "@/services/apiService";

const FarmRegistry = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch farms data
  const { data: farmList = [], refetch: refetchFarms } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.farms.getAllFarms(),
  });

  // Fetch all batches once
  const { data: allBatches = [] } = useQuery({
    queryKey: ['allBatches'],
    queryFn: () => api.batches.getAllBatches(),
  });

  // Group batches by farmId
  const batchesByFarmId: Record<string, any[]> = allBatches.reduce((acc, batch) => {
    const farmId = batch.farmId;
    if (!acc[farmId]) acc[farmId] = [];
    acc[farmId].push(batch);
    return acc;
  }, {} as Record<string, any[]>);

  // Filter farms based on search
  const filteredFarms = farmList.filter(farm =>
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle farm added event
  const handleFarmAdded = () => {
    refetchFarms();
  };

  // Handle view details click
  const handleViewDetails = (farmId: string) => {
    navigate(`/farm-details/${farmId}`);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-wool-darkBrown mb-4 md:mb-0">
          Farm Registry
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-wool-gray" />
            <Input
              type="text"
              placeholder="Search farms..."
              className="pl-8 border-wool-beige"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <NewFarmDialog onFarmAdded={handleFarmAdded} />
        </div>
      </div>

      {filteredFarms.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-wool-gray">No farms match your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFarms.map((farm) => {
            const farmBatches = batchesByFarmId[farm.id] || [];

            return (
              <Card key={farm.id} className="border-wool-beige hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="h-40 rounded-md overflow-hidden mb-2">
                    <img
                      src={`${farm.photo}?w=600&h=300&fit=crop&crop=focalpoint`}
                      alt={farm.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle>{farm.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-wool-gray" />
                    {farm.location}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Leaf className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm">Sheep Count</span>
                      </div>
                      <span className="font-medium">{farm.sheep_count}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Scissors className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm">Annual Production</span>
                      </div>
                      <span className="font-medium">{farm.annual_production} kg</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm">Joined</span>
                      </div>
                      <span className="font-medium">{new Date(farm.joined_date).toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm">Certifications</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {farm.certifications.map(cert => (
                          <Badge key={cert} variant="outline" className="bg-wool-beige border-wool-beige text-wool-darkBrown">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm">{farm.contact_person}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm">{farm.contact_email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between pt-2 border-t">
                  <div className="text-sm text-wool-gray">
                    Active Batches: <span className="font-medium">{farm.length}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="border-wool-beige hover:bg-wool-beige"
                    onClick={() => handleViewDetails(farm.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FarmRegistry;