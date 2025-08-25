import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/Button/PrimaryButton";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-whiter">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-primary">
          Page Not Found
        </h2>
        <p className="mt-2 text-body">
          The page you're looking for doesn't exist.
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

export default NotFound;
