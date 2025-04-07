
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Sheep2 as Sheep, 
  ShieldCheck, 
  User, 
  Mail, 
  CalendarDays, 
  Scissors, 
  Plus 
} from "lucide-react";
import { farms, woolBatches } from "@/data/wool-data";

const FarmRegistry = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter farms based on search term
  const filteredFarms = farms.filter(farm => 
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get wool batches for each farm
  const getFarmBatches = (farmId: string) => {
    return woolBatches.filter(batch => batch.farmId === farmId);
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
          <Button className="bg-wool-green hover:bg-wool-darkBrown text-white">
            <Plus className="mr-2 h-4 w-4" />
            Register New Farm
          </Button>
        </div>
      </div>

      {filteredFarms.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-wool-gray">No farms match your search criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFarms.map((farm) => {
            const farmBatches = getFarmBatches(farm.id);
            
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
                        <Sheep className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm">Sheep Count</span>
                      </div>
                      <span className="font-medium">{farm.sheepCount}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Scissors className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm">Annual Production</span>
                      </div>
                      <span className="font-medium">{farm.annualProduction} kg</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm">Joined</span>
                      </div>
                      <span className="font-medium">{new Date(farm.joinedDate).toLocaleDateString()}</span>
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
                        <span className="text-sm">{farm.contactPerson}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm">{farm.contactEmail}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2 border-t">
                  <div className="text-sm text-wool-gray">
                    Active Batches: <span className="font-medium">{farmBatches.length}</span>
                  </div>
                  <Button variant="outline" className="border-wool-beige hover:bg-wool-beige">
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
