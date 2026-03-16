
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useRef } from "react";
import { ImagePlus, X, Eye, EyeOff, Loader2 } from "lucide-react";
import s3Service from "@/services/waste-reports/S3Service";
import { toast } from "sonner";
import { EnterpriseUserService } from "@/services/enterprises/EnterpriseUserService";
import type { Enterprise } from "@/types/enterprise";

const userSchema = z.object({
  id: z.string(),
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(9, { message: "Phone must be at least 9 characters." }),
  roleId: z.enum(["1", "2", "3"]),
  status: z.enum(["ACTIVE", "SUSPENDED"]),
  password: z.string(),
  enterpriseName: z.string(),
  enterpriseDescription: z.string().optional(),
  enterprisePhoto: z.any().optional(),
}).superRefine((data, ctx) => {
  if (data.password && data.password.length < 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must be at least 6 characters.",
      path: ["password"],
    });
  }
  if (data.roleId === "2") {
    if (!data.enterpriseName || data.enterpriseName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enterprise name must be at least 2 characters.",
        path: ["enterpriseName"],
      });
    }
  }
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: UserFormValues;
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
}

export function UserForm({ initialData, onSubmit, onCancel }: UserFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsloading] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      roleId: initialData?.roleId || "1",
      status: "ACTIVE",
      password: "",
      enterpriseName: "",
      enterpriseDescription: "",
      enterprisePhoto: undefined,
    },
  });

  const watchedRoleId = form.watch("roleId");
  const isEnterprise = watchedRoleId === "2";

  const getEnterpriseById = async (id: string): Promise<Enterprise | null> => {
    try {
      const response = await EnterpriseUserService.getEnterpriseByUserId(id);
      return response.data;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const init = async () => {
      if (initialData) {
        // Only fetch enterprise data for enterprise users
        if (initialData.roleId === "2") {
          try {
            const enterprise = await getEnterpriseById(initialData.id);
            console.log(enterprise)
            if (enterprise) {
              const photoResponse = await s3Service.getImage(enterprise.photoUrl);
              form.reset({
                ...initialData,
                enterpriseName: enterprise.name,
                enterpriseDescription: enterprise.description,
                enterprisePhoto: photoResponse.data,
              });
              setPhotoPreview(photoResponse.data);
            }
          } catch (error) {
            console.error("Failed to load enterprise data", error);
          }
        }
      } else {
        form.reset({
          id: "",
          fullName: "",
          email: "",
          phone: "",
          roleId: "1",
          status: "ACTIVE",
          password: "",
          enterpriseName: "",
          enterpriseDescription: "",
          enterprisePhoto: undefined,
        });
        setPhotoPreview(null);
      }
    }

    init()
  }, [initialData, form]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("enterprisePhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    form.setValue("enterprisePhoto", undefined);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (data: UserFormValues) => {
    try {
      setIsloading(true)
      if (data.roleId === "2") {
        const photoResponse = await s3Service.uploadImage(data.enterprisePhoto);
        data.enterprisePhoto = photoResponse.data
      }
      onSubmit(data)
      setIsloading(false)
    } catch (error) {
      console.log(error)
      toast.error("Failed to create user")
      setIsloading(false)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!initialData && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="012345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Citizen</SelectItem>
                    <SelectItem value="2">Enterprise</SelectItem>
                    <SelectItem value="3">Collector</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {initialData && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Enterprise Fields - shown only when role is Enterprise */}
        {isEnterprise && (
          <div className="space-y-4 rounded-lg border border-orange-200 bg-orange-50/30 p-4">
            <p className="text-sm font-medium text-orange-500">Enterprise Information</p>
            <FormField
              control={form.control}
              name="enterpriseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enterprise Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corporation" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enterpriseDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the enterprise..."
                      className="resize-none bg-white"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Enterprise Photo</FormLabel>
              <div className="mt-2">
                {photoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={photoPreview}
                      alt="Enterprise photo preview"
                      className="h-32 w-32 rounded-lg object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors"
                  >
                    <ImagePlus size={24} />
                    <span className="mt-1 text-xs">Upload Photo</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </div> : "Save User"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
