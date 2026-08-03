import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-10 text-center font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-lg border border-gray-100">
        {/* Icon / Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-red-600">
          🔒 Access Denied
        </h1>

        {/* Message */}
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-500">
          You do not have permission to view this page. Please contact your administrator if you think this is a mistake.
        </p>

        {/* Navigation Button */}
        <div className="mt-6 sm:mt-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-95"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;