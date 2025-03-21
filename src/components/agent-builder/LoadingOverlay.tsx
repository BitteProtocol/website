export function LoadingOverlay() {
  return (
    <div className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center'>
      <div className='h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-purple-500' />
      <div className='text-center mt-4'>
        <h3 className='text-xl font-medium text-white'>Creating your agent</h3>
        <p className='text-zinc-400'>
          Assembling tools and configuring capabilities...
        </p>
      </div>
    </div>
  );
}
