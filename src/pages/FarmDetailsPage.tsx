
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Leaf, ShieldCheck, User, Mail, Calendar, Package } from "lucide-react";
import { farms, woolBatches, Farm, WoolBatch } from "@/data/wool-data";

const FarmDetailsPage = () => {
  const { farmId } = useParams();
  const navigate = useNavigate();
  
  // Find the farm by ID
  const farm = farms.find(f => f.id === farmId);
  
  // Get wool batches for this farm
  const farmBatches = woolBatches.filter(batch => batch.farmId === farmId);
  
  // Handle back button click
  const handleBack = () => {
    navigate('/farm-registry');
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // If farm not found
  if (!farm) {
    return (
      <div className="p-4 md:p-6">
        <Button onClick={handleBack} className="mb-4" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Farm Registry
        </Button>
        <Card className="border-wool-beige">
          <CardContent className="pt-6">
            <p className="text-center text-wool-gray">Farm not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      <Button onClick={handleBack} className="mb-4" variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Farm Registry
      </Button>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Card className="border-wool-beige mb-6">
            <div className="h-48 w-full overflow-hidden">
              <img
                src={`${farm.photo}?w=800&h=300&fit=crop&crop=focalpoint`}
                alt={farm.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">{farm.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-wool-gray" />
                    {farm.location}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <Tabs defaultValue="overview" className="w-full mb-6">
            <TabsList className="bg-wool-beige text-wool-brown mb-4">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white">Overview</TabsTrigger>
              <TabsTrigger value="batches" className="data-[state=active]:bg-white">Wool Batches</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <Card className="border-wool-beige">
                <CardHeader>
                  <CardTitle>Farm Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Leaf className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm font-medium">Sheep Count</span>
                      </div>
                      <p className="text-lg">{farm.sheepCount}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm font-medium">Joined Date</span>
                      </div>
                      <p className="text-lg">{formatDate(farm.joinedDate)}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-wool-brown" />
                        <span className="text-sm font-medium">Annual Production</span>
                      </div>
                      <p className="text-lg">{farm.annualProduction} kg</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2 text-wool-brown" />
                      <span className="text-sm font-medium">Certifications</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {farm.certifications.map(cert => (
                        <Badge key={cert} variant="outline" className="bg-wool-beige border-wool-beige text-wool-darkBrown">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="batches" className="mt-0">
              <Card className="border-wool-beige">
                <CardHeader>
                  <CardTitle>Wool Batches</CardTitle>
                  <CardDescription>All batches from this farm</CardDescription>
                </CardHeader>
                <CardContent>
                  {farmBatches.length === 0 ? (
                    <p className="text-center text-wool-gray py-6">No batches found for this farm.</p>
                  ) : (
                    <div className="space-y-4">
                      {farmBatches.map(batch => (
                        <div key={batch.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{batch.id.replace('batch-', 'Batch ')}</h3>
                            <Badge className="bg-wool-brown text-white">
                              {batch.currentStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {batch.weight}kg · {batch.grade} · {batch.color}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sheared: {formatDate(batch.shearDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full md:w-1/3">
          <Card className="border-wool-beige mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-wool-brown" />
                  <span className="text-sm font-medium">Contact Person</span>
                </div>
                <p>{farm.contactPerson}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-wool-brown" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p>{farm.contactEmail}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-wool-beige">
            <CardHeader>
              <CardTitle>Batch Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Batches</span>
                  <span className="font-medium">{farmBatches.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Weight</span>
                  <span className="font-medium">
                    {farmBatches.reduce((total, batch) => total + batch.weight, 0)} kg
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Quality Score</span>
                  <span className="font-medium">
                    {farmBatches.length > 0
                      ? Math.round(
                          farmBatches.reduce((total, batch) => total + batch.qualityScore, 0) / farmBatches.length
                        )
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FarmDetailsPage;
