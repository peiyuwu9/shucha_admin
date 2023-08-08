"use client";

import { MouseEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { Category, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Check, ChevronsUpDown, PencilLine } from "lucide-react";

import { routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ProductFormSchemaType, productFormSchema } from "@/lib/zObject";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CategoryModal } from "@/components/dashboard/products/category-modal";

export interface ProductFormProps {
  existingProduct: Product | null;
  categories: Category[] | null;
  isEdit: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  existingProduct,
  categories,
  isEdit,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const defaultValues = existingProduct
    ? {
        ...existingProduct,
      }
    : {};

  const form = useForm<ProductFormSchemaType>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ProductFormSchemaType) {
    console.log(data);
    try {
      setLoading(true);
      // if (isEdit) {
      //   const product = await createProduct();
      //   toast.success(`${product.name} is updated.`);
      // } else {
      //   const product = await createProduct();
      //   router.push(routes.products.pathname);
      //   toast.success(`${product.name} is created.`);
      // }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function onCancel(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    router.push(routes.products.pathname);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"combobox"}
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            `w-full justify-between`,
                            field.value || "text-muted-foreground"
                          )}
                        >
                          {field.value || "Select Category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent>
                      <Command>
                        <CommandInput placeholder="Search Category"></CommandInput>
                        <CommandEmpty>No Category Found</CommandEmpty>
                        {categories && (
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                key={category.id}
                                disabled={loading}
                                onSelect={(itemValue) => {
                                  field.onChange(
                                    itemValue === field.value ? "" : itemValue
                                  );
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === category.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {category.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      $
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="9.99"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="netWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Weight</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="300"
                        {...field}
                      />
                      g
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          {/* <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="flex gap-2">
            <Button disabled={loading} variant={"shucha"} type="submit">
              {isEdit ? "Save" : "Create"}
            </Button>
            <Button disabled={loading} variant={"outline"} onClick={onCancel}>
              Cnacel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export { ProductForm };