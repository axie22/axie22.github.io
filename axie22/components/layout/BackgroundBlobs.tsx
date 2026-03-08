export const BackgroundBlobs = () => {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none user-select-none">
        {/* Top Right Blob */}
        <div className="absolute -top-[10%] -right-[10%] w-[40rem] h-[40rem] bg-purple-500/20 rounded-full blur-2xl opacity-20 animate-pulse mix-blend-multiply dark:mix-blend-screen filter" />

        {/* Bottom Left Blob */}
        <div className="absolute -bottom-[10%] -left-[10%] w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-2xl opacity-20 animate-pulse mix-blend-multiply dark:mix-blend-screen filter" style={{ animationDelay: "2s" }} />
      </div>
    );
  };
