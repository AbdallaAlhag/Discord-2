// import AdComponent from "../AdComponent";

const ActiveNow: React.FC = function () {
  return (
    <div className="w-80 bg-[#2f3136] p-4 border-l border-[#202225] hidden lg:block ">
      <h2 className="text-white font-bold mb-4">Active Now</h2>
      <div className="text-center py-8">
        <h3 className="text-white font-semibold mb-2">It's quiet for now...</h3>
        <p className="text-[#B9BBBE] text-sm">
          When a friend starts an activity—like playing a game or hanging out on
          voice—we'll show it here!
        </p>
      </div>
      {/* <AdComponent adClient="ca-pub-9496966331104914" adSlot="9125565066" /> */}
    </div>
  );
};

export default ActiveNow;
