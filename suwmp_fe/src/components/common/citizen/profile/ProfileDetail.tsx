import { useEffect, useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ProfileStats from "./ProfileStats";
import { CitizenService } from "@/services/CitizenService";
import { useSelector } from "react-redux";
import type { CitizenProfileGetResponse } from "@/types/citizenProfile";
import { Loader2 } from "lucide-react";

interface RootState {
    user: {
        user: { id: string } | null;
    };
}

const ProfileDetail = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [profile, setProfile] = useState<CitizenProfileGetResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.id) {
                try {
                    const res = await CitizenService.getCitizenProfile(user.id);
                    if (res.data) setProfile(res.data);
                } catch (error) {
                    console.error("Failed to load profile", error);
                } finally {
                    setLoading(false);
                }
            } else setLoading(false);
        };
        fetchProfile();
    }, [user?.id]);

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

    return (
        <div className="flex-1 space-y-6">
            <ProfileInfo profile={profile} />
            <ProfileStats profile={profile} />
        </div>
    );
};

export default ProfileDetail;
