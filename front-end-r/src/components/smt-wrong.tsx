import { Link } from "react-router-dom";

const SmtError = ({ message = "An unexpected error has occurred." }) => {
  return (
    <div className="font-[poppins]">
      <div className="flex h-[80vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-4xl font-bold text-blue-600">500</h1>
        <h1 className="mb-4 text-4xl font-bold dark:text-gray-100">Error</h1>
        <p className="mb-6 text-lg dark:text-gray-400">{message}</p>
        <Link
          to="/"
          className="rounded bg-blue-700 px-6 py-2 text-white transition hover:bg-blue-900"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default SmtError;
