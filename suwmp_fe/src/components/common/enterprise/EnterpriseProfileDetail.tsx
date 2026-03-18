import { EnterpriseService } from "@/services/EnterpriseService";
import type { EnterpriseProfileGetResponse } from "@/types/enterprise";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Camera, Edit2, FileText, Leaf, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import z from "zod";
import EnterpriseProfileRating from "./EnterpriseProfileRating";

interface RootState {
    user: {
        user: { id: string } | null;
    };
}

const profileSchema = z.object({
  name: z
    .string()
    .regex(/^[A-Za-zÀ-ỹà-ỹ]+(?:\s[A-Za-zÀ-ỹà-ỹ]+)*$/, "Enterprise name must contain valid characters"),
  description: z
  .string()
  .min(10, "Description must be at least 10 characters long")
  .max(500, "Description must be at most 500 characters long"),
});
type ProfileSchema = z.infer<typeof profileSchema>;

const EnterpriseProfileDetail = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [profile, setProfile] = useState<EnterpriseProfileGetResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : "E";

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
          name: profile?.name || "",
          description: profile?.description || "",
        },
      });

    const fetchProfile = async () => {
        if (user?.id) {
            try {
                const res = await EnterpriseService.getEnterpriseProfile(user.id);
                if (res.data) setProfile(res.data);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        } else setLoading(false);
    };

    useEffect(() => {
        fetchProfile();
    }, [user?.id]);

    useEffect(() => {
      if (profile) {
        reset({
          name: profile.name || "",
          description: profile.description || "",
        });
      }
    }, [profile, reset]);

    if (loading) return (
        <div className="flex-1 flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
    );

    if (!profile) return (
        <div className="flex-1 flex justify-center items-center py-20 text-gray-500">
            Profile data not found.
        </div>
    );

    const onSubmit = async (data: ProfileSchema) => {
      setIsLoading(true);
      try {
        //await EnterpriseService.updateEnterpriseProfile(profile.id, data);
        console.log(data)
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } catch (error: any) {
        console.error("Failed to update profile", error);
        toast.error("Failed to update profile");
      } finally {
        setIsLoading(false);
      }
    };

    const handleCancel = () => {
    reset({
      name: profile?.name || "",
      description: profile?.description || "",
    });
    setIsEditing(false);
  };

    return (
        <div className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-[#4ade80] to-[#0f766e] rounded-3xl flex items-center justify-center text-white text-4xl font-semibold shadow-lg">
              {initial}
            </div>
            <button className="absolute -bottom-2 -right-2 bg-white text-green-600 p-2 rounded-full shadow-md border border-gray-100">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1.5">
              <Leaf className="w-4 h-4 text-green-500" />
              Joined in{" "}
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Edit / Save */}
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-medium bg-white shadow-sm"
            >
              <X className="w-4 h-4 mr-2 text-gray-500" /> Cancel
            </button>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="flex items-center px-4 py-2 border border-transparent text-white rounded-full text-sm font-medium bg-green-600 shadow-sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-full text-sm font-medium bg-white shadow-sm"
          >
            <Edit2 className="w-4 h-4 mr-2 text-gray-500" /> Edit Profile
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-2xl">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Enterprise Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Building2 className="h-4 w-4 text-gray-400" />
            </div>
            <input
              {...register("name")}
              disabled={!isEditing || isLoading}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-md text-sm
                ${errors.name ? "border-red-500" : ""}
                ${isEditing 
                  ? "bg-white border-gray-300" 
                  : "bg-gray-50 border-gray-200 text-gray-600"
                }
              `}
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <input
              {...register("description")}
              disabled={!isEditing || isLoading}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-md text-sm
                ${errors.description ? "border-red-500" : ""}
                ${isEditing 
                  ? "bg-white border-gray-300" 
                  : "bg-gray-50 border-gray-200 text-gray-600"
                }
              `}
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>

          <div className="flex items-center gap-3 px-3 py-2.5 border rounded-md bg-gray-50 border-gray-200">
            <EnterpriseProfileRating value={profile.rating || 0} />


          </div>
        </div>

      </div>
    </div>
        </div>
    );
};

export default EnterpriseProfileDetail;
