import Image from "next/image";

interface LoaderProps {
  isVisible?: boolean;
}

export function Loader({ isVisible = true }: LoaderProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white/0 flex justify-center items-center z-[9999]">
      <Image
        src="/loader.gif"
        alt="Loading"
        width={44}
        height={44}
        className="w-auto h-auto max-w-[200px]"
        unoptimized
      />
    </div>
  );
}
