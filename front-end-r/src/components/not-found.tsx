const NotFound = () => {
  return (
    <div className="font-[poppins]">
      <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-4 text-4xl font-bold text-blue-600">404</h1>
        <h1 className="mb-4 text-4xl font-bold text-black">Not Found</h1>
        <p className="mb-6 text-lg text-gray-700">
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="rounded bg-blue-700 px-6 py-2 text-white transition hover:bg-blue-900"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFound;
