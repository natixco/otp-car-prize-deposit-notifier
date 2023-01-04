import clsx from "clsx";

type SizeVariants = 'base' | 'lg';

interface Props {
  label: string;
  onClick: () => void;
  size?: SizeVariants;
}

const sizeVariants: Record<SizeVariants, string> = {
  base: 'px-3 py-1',
  lg: 'px-6 py-3',
};

export default function Button(props: Props) {
  return (
    <button
      className={clsx(
        'bg-transparent border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white font-medium rounded-md',
        sizeVariants[props.size ?? 'base'],
      )}
      onClick={() => props.onClick()}>
      {props.label}
    </button>
  );
}