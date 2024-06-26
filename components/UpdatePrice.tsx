import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  price: z.number().min(0),
});

type FormValues = z.infer<typeof schema>;

export function UpdatePrice() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: { price: number }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/price", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Price updated successfully",
          description: `New price: $${data.price}`,
        });
      } else {
        throw new Error("Failed to update price");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update price",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-slate-500"
        >
          New Price
        </label>
        <div className="flex items-center max-w-52">
          <Input
            id="price"
            type="number"
            step="1.00"
            {...register("price", { valueAsNumber: true })}
            className="mt-1 mr-5 h-auto"
          />
          {errors.price && (
            <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="text-secondary h-8"
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </form>
  );
}
