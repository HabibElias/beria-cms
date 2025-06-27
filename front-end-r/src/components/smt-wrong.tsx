const SmtError = ({ message = "An unexpected error has occurred." }) => {
  return (
    <div>
      <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-4 text-4xl font-bold text-red-600">Error</h1>
        <h1 className="mb-4 text-2xl font-bold text-black">{message}</h1>
        <a
          href="/"
          className="rounded bg-[#9191ff] px-6 py-2 text-white transition hover:bg-[#9191ff]/70"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default SmtError;
