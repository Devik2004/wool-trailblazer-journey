// BatchTracking.tsx

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Package, 
  Calendar, 
  Scale, 
  Sparkles, 
  Palette, 
  MapPin, 
  History, 
  ShieldCheck,
  Plus
} from "lucide-react";
import axios from "axios";
import NewBatchDialog from "./NewBatchDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
type JourneyStep = {
  status: string;
  location: string;
  timestamp: string;
  handledBy: string;
  notes?: string;
};

type WoolBatch = {
  id: string;
  farm: string;
  shear_date: string;
  weight: number;
  grade: string;
  color: string;
  qualityScore: number;
  current_status: string;
  current_location: string;
  journeyHistory?: JourneyStep[]; 
};

type Farm = {
  id: string;
  name: string;
};

const statusOptions = [
  "Sheared",
  "Sorted",
  "Cleaned",
  "Processed",
  "Spun",
  'Dyed',
  'Woven',
  'Finished',
  'Delivered'

];

const UpdateJourneyDialog = ({ batchList, onUpdate }: { batchList: WoolBatch[], onUpdate: () => void }) => {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [handledBy, setHandledBy] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8000/api/journey-history/update-by-batch/${selectedBatch}/`,
        {
          status,
          location,
          handled_by: handledBy
        }
      );
      onUpdate();
      setIsOpen(false);
      // Reset form
      setSelectedBatch("");
      setStatus("");
      setLocation("");
      setHandledBy("");
    } catch (error) {
      console.error("Failed to update journey", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-wool-green text-white hover:bg-wool-darkGreen">
          <Plus className="h-4 w-4 mr-2" />
          Update Journey
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Batch Journey</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batch">Batch ID</Label>
            <Select value={selectedBatch} onValueChange={setSelectedBatch} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {batchList.map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.id.replace('batch-', 'Batch ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="handledBy">Handled By</Label>
            <Input
              id="handledBy"
              value={handledBy}
              onChange={(e) => setHandledBy(e.target.value)}
              placeholder="Enter handler name/team"
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-wool-green hover:bg-wool-darkGreen">
            Update Journey
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const BatchTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [batchList, setBatchList] = useState<WoolBatch[]>([]);
  const [farmsData, setFarmsData] = useState<Farm[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [batchesRes, farmsRes, journeyRes] = await Promise.all([
        axios.get("http://localhost:8000/api/wool-batches/"),
        axios.get("http://localhost:8000/api/farms/"),
        axios.get("http://localhost:8000/api/journey-history/")
      ]);

      const batches: WoolBatch[] = batchesRes.data;
      const journeySteps: any[] = journeyRes.data;

      // Group journey steps by batch ID
      const journeyMap: Record<string, JourneyStep[]> = {};
      journeySteps.forEach(step => {
        const formattedStep: JourneyStep = {
          status: step.status,
          location: step.location,
          timestamp: step.timestamp,
          handledBy: step.handled_by,
          notes: step.notes,
        };
        if (!journeyMap[step.batch]) {
          journeyMap[step.batch] = [];
        }
        journeyMap[step.batch].push(formattedStep);
      });

      const enrichedBatches = batches.map(batch => ({
        ...batch,
        journeyHistory: journeyMap[batch.id] || []
      }));

      setBatchList(enrichedBatches);
      setFarmsData(farmsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getFarmName = (farmId: string) => {
    const farm = farmsData.find(f => f.id == farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  const handleBatchAdded = async () => {
    await fetchData();
  };

  const filteredBatches = batchList.filter(batch =>
    (batch.id?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (batch.current_status?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (batch.current_location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const getStatusBadgeColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'Sheared': 'bg-wool-beige text-wool-darkBrown',
      'Sorted': 'bg-wool-beige text-wool-darkBrown',
      'Cleaned': 'bg-wool-beige text-wool-darkBrown',
      'Processed': 'bg-wool-brown text-white',
      'Spun': 'bg-wool-brown text-white',
      'Dyed': 'bg-wool-brown text-white',
      'Woven': 'bg-wool-darkBrown text-white',
      'Finished': 'bg-wool-darkBrown text-white',
      'Delivered': 'bg-wool-green text-white',
    };
    return statusColors[status] || 'bg-wool-gray';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderBatchDetails = (batch: WoolBatch) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: Calendar, label: "Shear Date", value: formatDate(batch.shear_date) },
          { icon: Scale, label: "Weight", value: `${batch.weight} kg` },
          { icon: Sparkles, label: "Grade", value: batch.grade },
          { icon: Palette, label: "Color", value: batch.color },
          { icon: MapPin, label: "Current Location", value: batch.current_location },
          { icon: ShieldCheck, label: "Quality Score", value: `${batch.qualityScore}/100` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon className="h-4 w-4 mr-1" />
              {label}
            </div>
            <div className="font-medium">{value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <History className="h-4 w-4 mr-1" />
          Journey History
        </div>
        <div className="border rounded">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Handled By</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batch.journeyHistory && batch.journeyHistory.length > 0 ? (
                batch.journeyHistory.map((step, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(step.status)}>
                        {step.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{step.location}</TableCell>
                    <TableCell>{formatTimestamp(step.timestamp)}</TableCell>
                    <TableCell>{step.handledBy}</TableCell>
                    <TableCell>{step.notes || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                    No journey history available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-wool-darkBrown mb-4 md:mb-0">
          Batch Tracking
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-wool-gray" />
            <Input
              type="text"
              placeholder="Search batches..."
              className="pl-8 border-wool-beige"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <NewBatchDialog onBatchAdded={handleBatchAdded} statusOptions={statusOptions} />
            <UpdateJourneyDialog batchList={batchList} onUpdate={fetchData} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="bg-wool-beige text-wool-brown mb-4">
          <TabsTrigger value="grid" className="data-[state=active]:bg-white">Grid View</TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-white">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {filteredBatches.length === 0 ? (
            <div className="text-center p-8 text-wool-gray">
              No batches match your search criteria.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBatches.map(batch => (
                <Card key={batch.id} className="border-wool-beige hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 mr-2 text-wool-brown" />
                        <CardTitle className="text-lg">{batch.id.replace('batch-', 'Batch ')}</CardTitle>
                      </div>
                      <Badge className={getStatusBadgeColor(batch.current_status)}>
                        {batch.current_status}
                      </Badge>
                    </div>
                    <CardDescription>From {getFarmName(batch.farm)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="details" className="border-b-0">
                        <AccordionTrigger className="py-2 hover:no-underline">
                          <span className="text-sm font-medium">Batch Details</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          {renderBatchDetails(batch)}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          <Card className="border-wool-beige">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Farm</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Current Location</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Shear Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map(batch => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.id.replace('batch-', 'Batch ')}</TableCell>
                      <TableCell>{getFarmName(batch.farm)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(batch.current_status)}>
                          {batch.current_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{batch.current_location}</TableCell>
                      <TableCell>{batch.weight} kg</TableCell>
                      <TableCell>{batch.grade}</TableCell>
                      <TableCell>{formatDate(batch.shear_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BatchTracking;