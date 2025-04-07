
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Plus } from "lucide-react";
import { farms } from "@/data/wool-data";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";

// Batch form schema
const batchFormSchema = z.object({
  farmId: z.string().min(1, "Farm is required"),
  weight: z.coerce.number().min(1, "Weight must be at least 1kg"),
  grade: z.enum(["Fine", "Medium", "Coarse", "Superfine"] as const),
  color: z.string().min(1, "Color is required"),
  qualityScore: z.coerce.number().min(1).max(100, "Quality score must be between 1-100"),
  notes: z.string().optional(),
});

type BatchFormValues = z.infer<typeof batchFormSchema>;

interface NewBatchDialogProps {
  onBatchAdded: () => void;
}

const NewBatchDialog = ({ onBatchAdded }: NewBatchDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch farms data from API
  const { data: farmList = [] } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.farms.getAllFarms(),
  });
  
  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      farmId: "",
      weight: undefined,
      grade: "Fine",
      color: "White",
      qualityScore: 80,
      notes: "",
    },
  });

  const onSubmit = async (data: BatchFormValues) => {
    try {
      // Create new batch using the API service
      const newBatch = await api.batches.createBatch({
        farmId: data.farmId,
        weight: data.weight,
        grade: data.grade,
        color: data.color,
        qualityScore: data.qualityScore,
        notes: data.notes
      });
      
      // Show success toast
      toast({
        title: "Batch Added",
        description: `Batch ${newBatch.id} has been successfully added.`,
      });
      
      // Close dialog and reset form
      setOpen(false);
      form.reset();
      
      // Notify parent of the update
      onBatchAdded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add new batch. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-wool-green hover:bg-wool-darkBrown text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add New Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Wool Batch</DialogTitle>
          <DialogDescription>
            Enter the details of the newly sheared wool batch.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="farmId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a farm" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {farmList.map(farm => (
                        <SelectItem key={farm.id} value={farm.id}>
                          {farm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="450" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fine">Fine</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Coarse">Coarse</SelectItem>
                        <SelectItem value="Superfine">Superfine</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="White" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="qualityScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quality Score (1-100)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="80" min="1" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Any special observations about this batch..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-wool-green hover:bg-wool-darkBrown text-white"
              >
                Add Batch
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewBatchDialog;
