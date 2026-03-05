const ProfileStats = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-green-600 mb-1">42</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reports</span>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-green-600 mb-1">128kg</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recycled</span>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-green-600 mb-1">17</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Feedbacks</span>
            </div>
        </div>
    );
};

export default ProfileStats;
