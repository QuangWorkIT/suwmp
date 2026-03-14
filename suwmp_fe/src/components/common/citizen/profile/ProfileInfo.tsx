import { useState } from "react";
import { Camera, Edit2, Leaf, Phone, Mail, User, Save, X, Loader2 } from "lucide-react";
import type { CitizenProfileGetResponse } from "@/types/citizenProfile";
import { CitizenService } from "@/services/CitizenService";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const profileSchema = z.object({
  fullName: z
    .string()
    .regex(/^[A-Za-zÀ-ỹà-ỹ]+(?:\s[A-Za-zÀ-ỹà-ỹ]+)*$/, "Full name must contain valid characters"),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9]{9}$/, "Invalid phone number"),
  email: z.email(),
});
type ProfileSchema = z.infer<typeof profileSchema>;

interface ProfileInfoProps {
  profile: CitizenProfileGetResponse;
  onProfileUpdate?: () => void;
}

const ProfileInfo = ({ profile, onProfileUpdate }: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initial = profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      email: profile.email || "",
    },
  });

  const onSubmit = async (data: ProfileSchema) => {
    setIsLoading(true);
    try {
      await CitizenService.updateCitizenProfile(profile.citizenId, data);
      setIsEditing(false);
      onProfileUpdate?.();
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
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      email: profile.email || "",
    });
    setIsEditing(false);
  };

  return (
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.fullName}</h1>
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
            <p className="text-sm font-medium text-gray-500">
              <span className="text-gray-700 font-semibold">
                {profile.points?.toLocaleString() || 0}
              </span>{" "}
              Points
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <input
              {...register("fullName")}
              disabled={!isEditing || isLoading}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-md text-sm
                ${errors.fullName ? "border-red-500" : ""}
                ${isEditing 
                  ? "bg-white border-gray-300" 
                  : "bg-gray-50 border-gray-200 text-gray-600"
                }
              `}
            />
          </div>
          {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Phone className="h-4 w-4 text-gray-400" />
            </div>
            <input
              {...register("phone")}
              disabled={!isEditing || isLoading}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-md text-sm
                ${errors.phone ? "border-red-500" : ""}
                ${isEditing 
                  ? "bg-white border-gray-300" 
                  : "bg-gray-50 border-gray-200 text-gray-600"
                }
              `}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              {...register("email")}
              disabled={!isEditing || isLoading}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-md text-sm
                ${errors.email ? "border-red-500" : ""}
                ${isEditing 
                  ? "bg-white border-gray-300" 
                  : "bg-gray-50 border-gray-200 text-gray-600"
                }
              `}
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;