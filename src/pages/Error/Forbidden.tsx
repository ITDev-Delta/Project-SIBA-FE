import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/Button/PrimaryButton";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">403</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Access Forbidden
        </h2>
        <p className="mt-2 text-gray-600">
          You don't have permission to access this resource.
        </p>
        <div className="mt-6 space-x-4">
          <PrimaryButton onClick={() => navigate("/")}>
            Go to Dashboard
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
