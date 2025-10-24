export const INPUT_VARIANTS: Record<
  "light" | "dark",
  {
    inputBase: string;
    inputBgWhenDisabled?: string;
    labelBase: string;
    wrapperBase: string;
  }
> = {
  light: {
    wrapperBase: "w-full flex flex-col gap-1 relative",
    inputBase: "w-full p-2 rounded-lg border-2 font-lato font-semibold",
    labelBase: "font-semibold text-md font-lato",
  },
  dark: {
    wrapperBase: "w-full flex flex-col gap-1 relative",
    inputBase:
      "w-full h-11 px-4 border-2 rounded-lg flex items-center font-lato font-semibold bg-dark",
    labelBase: "block mb-1 text-md font-bold font-lato",
  },
};
