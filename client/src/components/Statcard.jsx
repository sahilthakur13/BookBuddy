const accentClasses = {
  violet: "bg-violet-600/15 text-violet-400 border-violet-600/30",
  orange: "bg-orange-600/15 text-orange-400 border-orange-600/30",
};

const StatCard = ({ label, value, icon: Icon, accent = "violet" }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg border ${accentClasses[accent]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-zinc-400">{label}</p>
        <p className="text-2xl font-bold text-zinc-50">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;