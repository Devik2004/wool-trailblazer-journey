
import { useState } from "react";
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
import { woolBatches, farms, WoolBatch } from "@/data/wool-data";
import NewBatchDialog from "./NewBatchDialog";

const BatchTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [batchList, setBatchList] = useState([...woolBatches]);
  
  // Filter batches based on search term
  const filteredBatches = batchList.filter(batch => 
    batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.currentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.currentLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get farm name by ID
  const getFarmName = (farmId: string) => {
    const farm = farms.find(f => f.id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  // Status badge color mapping
  const getStatusBadgeColor = (status: string) => {
    const statusColors: {[key: string]: string} = {
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Format timestamp to date and time
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle batch added event
  const handleBatchAdded = () => {
    setBatchList([...woolBatches]);
  };

  // Render batch details
  const renderBatchDetails = (batch: WoolBatch) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            Shear Date
          </div>
          <div className="font-medium">{formatDate(batch.shearDate)}</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Scale className="h-4 w-4 mr-1" />
            Weight
          </div>
          <div className="font-medium">{batch.weight} kg</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 mr-1" />
            Grade
          </div>
          <div className="font-medium">{batch.grade}</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Palette className="h-4 w-4 mr-1" />
            Color
          </div>
          <div className="font-medium">{batch.color}</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            Current Location
          </div>
          <div className="font-medium">{batch.currentLocation}</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 mr-1" />
            Quality Score
          </div>
          <div className="font-medium">{batch.qualityScore}/100</div>
        </div>
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
              {batch.journeyHistory.map((step, index) => (
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
              ))}
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
          <NewBatchDialog onBatchAdded={handleBatchAdded} />
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="bg-wool-beige text-wool-brown mb-4">
          <TabsTrigger value="grid" className="data-[state=active]:bg-white">
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-white">
            List View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="mt-0">
          {filteredBatches.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-wool-gray">No batches match your search criteria.</p>
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
                      <Badge className={getStatusBadgeColor(batch.currentStatus)}>
                        {batch.currentStatus}
                      </Badge>
                    </div>
                    <CardDescription>
                      From {getFarmName(batch.farmId)}
                    </CardDescription>
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
        
        <TabsContent value="list" className="mt-0">
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
                      <TableCell>{getFarmName(batch.farmId)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(batch.currentStatus)}>
                          {batch.currentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{batch.currentLocation}</TableCell>
                      <TableCell>{batch.weight} kg</TableCell>
                      <TableCell>{batch.grade}</TableCell>
                      <TableCell>{formatDate(batch.shearDate)}</TableCell>
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
