const MemberList: React.FC = function () {
  return (
    <div className="w-60 bg-[#2f3136] p-4">
      <h3 className="text-[#8e9297] uppercase text-xs font-semibold mb-4">
        Online — 1
      </h3>
      <div className="flex items-center mb-3 cursor-pointer hover:bg-[#36393f] p-2 rounded">
        <div className="w-8 h-8 rounded-full bg-[#36393f] relative">
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3ba55d] rounded-full border-2 border-[#2f3136]"></div>
        </div>
        <span className="text-[#dcddde] ml-2">User</span>
      </div>
    </div>
  );
};

export default MemberList;
