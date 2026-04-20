import { Link, useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError() as string;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        Something Went Wrong
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        We're sorry, but something went wrong. Please try again later.
      </p>
      {import.meta.env.DEV && (
        <p className="text-lg text-gray-700 mb-6">{error}</p>
      )}
      <Link
        to={"/"}
        className="text-blue-500 hover:text-blue-700 font-semibold"
      >
        Go Back to Home
      </Link>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404 Not Found</h1>
      <p className="text-lg text-gray-700 mb-6">
        Looks like nothing is here on this page.
      </p>
      <Link
        to={"/"}
        className="text-blue-500 hover:text-blue-700 font-semibold"
      >
        Go Back to Home
      </Link>
    </div>
  );
}
