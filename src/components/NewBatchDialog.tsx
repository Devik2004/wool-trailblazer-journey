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
  SelectValue
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Batch form schema
const batchFormSchema = z.object({
  id: z.string().min(1, "Batch ID is required"),
  farmId: z.string().min(1, "Farm is required"),
  weight: z.coerce.number().min(1, "Weight must be at least 1kg"),
  grade: z.enum(["Fine", "Medium", "Coarse", "Superfine"] as const),
  color: z.string().min(1, "Color is required"),
  qualityScore: z.coerce.number().min(1).max(100, "Quality score must be between 1-100"),
  notes: z.string().optional(),
  journeyStatus: z.string().min(1, "Status is required"),
  journeyLocation: z.string().min(1, "Location is required"),
  handledBy: z.string().min(1, "Handled by is required"),
  journeyNotes: z.string().optional(),
});

type BatchFormValues = z.infer<typeof batchFormSchema>;

// interface NewBatchDialogProps {
//   onBatchAdded: () => void;
// }


interface NewBatchDialogProps {
  onBatchAdded: () => void;
  statusOptions: string[];
}

const NewBatchDialog = ({ onBatchAdded,statusOptions }: NewBatchDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: farmList = [] } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.farms.getAllFarms(),
  });

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      id: "",
      farmId: "",
      weight: undefined,
      grade: "Fine",
      color: "White",
      qualityScore: 80,
      notes: "",
      journeyStatus: "In Transit",
      journeyLocation: "Wool Transport Depot",
      handledBy: "",
      journeyNotes: "",
    },
  });

  const onSubmit = async (data: BatchFormValues) => {
    try {
      const newBatch = await api.batches.createBatch({
        id: data.id,
        farm: data.farmId,
        weight: data.weight,
        grade: data.grade,
        color: data.color,
        current_status: "Shorn",
        current_location: "Farm Warehouse",
        quality_score: (data.qualityScore / 10).toFixed(1),
      });

      await axios.post("http://localhost:8000/api/journey-history/", {
        batch: data.id,
        status: data.journeyStatus,
        location: data.journeyLocation,
        handled_by: data.handledBy,
        notes: data.journeyNotes,
      });

      toast({
        title: "Batch Added",
        description: `Batch ${newBatch.id} has been successfully added.`,
      });

      setOpen(false);
      form.reset();
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
            <FormField control={form.control} name="id" render={({ field }) => (
              <FormItem>
                <FormLabel>Batch ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter unique batch ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="farmId" render={({ field }) => (
              <FormItem>
                <FormLabel>Farm</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a farm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {farmList.map(farm => (
                      <SelectItem key={farm.id} value={farm.id}>{farm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="450" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="grade" render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              )} />

              <FormField control={form.control} name="color" render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="White" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="qualityScore" render={({ field }) => (
                <FormItem>
                  <FormLabel>Quality Score (1-100)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="80" min="1" max="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input placeholder="Any special observations about this batch..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Journey History Fields */}
            {/* <FormField control={form.control} name="journeyStatus" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input placeholder="In Transit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} /> */}

<FormField
  control={form.control}
  name="journeyStatus"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Status</FormLabel>
      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {statusOptions.map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>


            <FormField control={form.control} name="journeyLocation" render={({ field }) => (
              <FormItem>
                <FormLabel>Current Location</FormLabel>
                <FormControl>
                  <Input placeholder="Wool Transport Depot" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="handledBy" render={({ field }) => (
              <FormItem>
                <FormLabel>Handled By</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="journeyNotes" render={({ field }) => (
              <FormItem>
                <FormLabel>Journey Notes</FormLabel>
                <FormControl>
                  <Input placeholder="Left farm at 6 AM, estimated arrival by noon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-wool-green hover:bg-wool-darkBrown text-white">
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
