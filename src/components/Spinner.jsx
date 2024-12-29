import { ClipLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="min-h-[525px] flex justify-center items-center bg-transparent">
      <ClipLoader size={150} color="currentColor" className="text-blue-600 dark:text-blue-400" />
    </div>
  );
};
export default Spinner;