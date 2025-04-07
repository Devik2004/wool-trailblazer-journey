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
import api from "../services/apiService";

const farmFormSchema = z.object({
  id: z.string().min(1, "Farm ID is required"),
  name: z.string().min(3, "Farm name must be at least 3 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  sheepCount: z.coerce.number().min(1, "Must have at least 1 sheep"),
  annualProduction: z.coerce.number().min(1, "Must have at least 1kg production"),
  contactPerson: z.string().min(3, "Contact name must be at least 3 characters"),
  contactEmail: z.string().email("Must be a valid email address"),
  certifications: z.string(),
  photo: z.string().url("Must be a valid URL").optional().default("https://images.unsplash.com/photo-1516466823543-f945a3732093"),
});

type FarmFormValues = z.infer<typeof farmFormSchema>;

interface NewFarmDialogProps {
  onFarmAdded: () => void;
}

const NewFarmDialog = ({ onFarmAdded }: NewFarmDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FarmFormValues>({
    resolver: zodResolver(farmFormSchema),
    defaultValues: {
      id: "",
      name: "",
      location: "",
      sheepCount: undefined,
      annualProduction: undefined,
      contactPerson: "",
      contactEmail: "",
      certifications: "",
      photo: "https://images.unsplash.com/photo-1516466823543-f945a3732093",
    },
  });

  const onSubmit = async (data: FarmFormValues) => {
    try {
      const certificationArray = data.certifications
        .split(',')
        .map(cert => cert.trim())
        .filter(cert => cert.length > 0);

      const newFarmData = {
        id: data.id,
        name: data.name,
        location: data.location,
        sheep_count: data.sheepCount,
        annual_production: data.annualProduction,
        certifications: certificationArray,
        contact_person: data.contactPerson,
        contact_email: data.contactEmail,
        photo: data.photo || "https://images.unsplash.com/photo-1516466823543-f945a3732093",
      };

      await api.farms.createFarm(newFarmData);

      toast({
        title: "Farm Registered",
        description: `${data.name} has been successfully registered.`,
      });

      setOpen(false);
      form.reset();
      onFarmAdded();
    } catch (error) {
      // handled in api layer
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-wool-green hover:bg-wool-darkBrown text-white">
          <Plus className="mr-2 h-4 w-4" />
          Register New Farm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Farm</DialogTitle>
          <DialogDescription>
            Enter the farm details to register in the system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* ✅ Farm ID */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm ID</FormLabel>
                    <FormControl>
                      <Input placeholder="FARM001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Highland Sheep Ranch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Scottish Highlands" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sheepCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sheep Count</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="annualProduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Production (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="certifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Organic, Sustainable Wool" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Photo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/farm.jpg" {...field} />
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
                className="mt-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-wool-green hover:bg-wool-darkBrown text-white mt-2"
              >
                Register Farm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFarmDialog;
