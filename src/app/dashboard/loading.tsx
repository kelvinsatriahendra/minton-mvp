export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Skeleton Header */}
        <div className="h-10 bg-[#1D1D1D] rounded-lg w-1/3 mb-8 animate-pulse"></div>
        
        {/* Skeleton Search Bar */}
        <div className="h-12 bg-[#1D1D1D] rounded-xl w-full mb-8 animate-pulse"></div>

        {/* Skeleton List Items */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#1D1D1D] border border-[#333] p-4 rounded-xl flex justify-between items-center animate-pulse">
              <div className="flex gap-4 items-center w-full">
                <div className="h-12 w-12 bg-[#333] rounded-lg"></div>
                <div className="space-y-2 w-1/2">
                  <div className="h-4 bg-[#333] rounded w-3/4"></div>
                  <div className="h-3 bg-[#333] rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-10 w-24 bg-[#333] rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
