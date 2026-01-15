export const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-[10px] font-black text-blue-500 uppercase animate-pulse tracking-widest">
      Processando mídias...
    </p>
  </div>
)
