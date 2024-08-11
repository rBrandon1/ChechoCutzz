import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  price: z.number().min(0),
});

type FormValues = z.infer<typeof schema>;

export function UpdatePrice() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const fetchCurrentPrice = async () => {
    try {
      const response = await fetch("/api/price", {
        method: "GET",
      });

      const data = await response.json();

      setCurrentPrice(data.price);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch price",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCurrentPrice();
  }, []);

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
        fetchCurrentPrice();
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
          className="text-base block font-medium text-muted-foreground pb-1"
        >
          Current Price - ${currentPrice}
        </label>
        <div className="flex items-center">
          <Input
            id="price"
            type="number"
            step="1.00"
            {...register("price", { valueAsNumber: true })}
            className="mt-1 mr-5 h-auto max-w-20"
          />
          {errors.price && (
            <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="text-secondary h-8"
          >
            {isLoading ? "Updating Price..." : "Update Price"}
          </Button>
        </div>
      </div>
    </form>
  );
}
