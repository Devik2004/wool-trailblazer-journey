import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, MapPin, Leaf, ShieldCheck, User, Mail, Calendar, Package
} from "lucide-react";

interface Farm {
  id: string;
  name: string;
  location: string;
  photo: string;
  sheepCount: number;
  joinedDate: string;
  annualProduction: number;
  certifications: string[];
  contactPerson: string;
  contactEmail: string;
}

interface WoolBatch {
  id: string;
  farmId: string;
  weight: number;
  grade: string;
  color: string;
  shearDate: string;
  currentStatus: string;
  qualityScore: number;
}

const FarmDetailsPage = () => {
  const { farmId } = useParams();
  const navigate = useNavigate();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [farmBatches, setFarmBatches] = useState<WoolBatch[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:8000/api";

  useEffect(() => {
    const fetchFarmDetails = async () => {
      try {
        const farmRes = await fetch(`${API_BASE}/farms/${farmId}/`);
        const batchRes = await fetch(`${API_BASE}/wool-batches/`);
        if (!farmRes.ok || !batchRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const farmData = await farmRes.json();
        const batchesData = await batchRes.json();

        const transformedFarm: Farm = {
          id: farmData.id,
          name: farmData.name,
          location: farmData.location,
          photo: farmData.photo,
          sheepCount: farmData.sheep_count,
          joinedDate: farmData.joined_date,
          annualProduction: farmData.annual_production,
          certifications: farmData.certifications,
          contactPerson: farmData.contact_person,
          contactEmail: farmData.contact_email,
        };

        const transformedBatches: WoolBatch[] = batchesData.map((batch: any) => ({
          id: batch.id,
          farmId:batch.farm,
          weight: batch.weight,
          grade: batch.grade,
          color: batch.color,
          shearDate: batch.shear_date,
          currentStatus: batch.current_status,
          qualityScore: batch.quality_score,
        }));
        console.log(transformedBatches);

        setFarm(transformedFarm);
        setFarmBatches(transformedBatches.filter(batch => batch.farmId === farmId));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmDetails();
  }, [farmId]);

  const handleBack = () => {
    navigate('/farm-registry');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

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
                  {farmBatches.reduce((total, batch) => total + (typeof batch.weight === 'number' ? batch.weight : 0), 0)} kg

                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Quality Score</span>
                  <span className="font-medium">
                  {farmBatches.length > 0
  ? Math.round(
      farmBatches.reduce((total, batch) => total + Number(batch.qualityScore || 0), 0) / farmBatches.length
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
