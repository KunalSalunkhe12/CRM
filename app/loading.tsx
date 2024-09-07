import Loader from "@/components/shared/Loader";

export default function Loading() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-white dark:bg-black">
      <Loader />
    </div>
  );
}
