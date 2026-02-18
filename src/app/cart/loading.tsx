

const Loading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
      {/* Animated spinner */}
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-l-transparent border-r-gray-400 border-b-gray-400 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-gray-200"></div>
      </div>
    </div>
  );
};

export default Loading;
