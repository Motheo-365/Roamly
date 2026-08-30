import "../../styles/loader.css"

interface LoaderProps {
  message?: string;
}

function Loader({ message = "Loading your trip..." }: LoaderProps) {
  return (
    <div className="loader-page">
      <div className="loader-content">
        <div className="loader-spinner">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default Loader;