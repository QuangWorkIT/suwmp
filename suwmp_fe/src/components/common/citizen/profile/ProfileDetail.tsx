import ProfileInfo from "./ProfileInfo";
import ProfileStats from "./ProfileStats";

const ProfileDetail = () => {
    return (
        <div className="flex-1 space-y-6">
            <ProfileInfo />
            <ProfileStats />
        </div>
    );
};

export default ProfileDetail;
