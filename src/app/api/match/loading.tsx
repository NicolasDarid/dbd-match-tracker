import Image from "next/image";

export default function LoadingAddMatch() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white gap-6 bg-black">
      {/* Logo style DBD */}
      <div className="relative w-20 h-20 animate-pulse">
        <Image
          src="/logo.png"
          alt="Loading"
          layout="fill"
          objectFit="contain"
        />
      </div>

      {/* Texte animé */}
      <p className="text-xl tracking-wide animate-pulse text-center">
        Summoning the Entity...
      </p>

      {/* Bar d'attente stylisée */}
      <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full w-full animate-loading bg-red-700 rounded-full" />
      </div>
    </div>
  );
}
