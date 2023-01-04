import clsx from 'clsx';

type SizeVariants = 'base' | 'lg';
type ThemeVariants = 'primary' | 'secondary';

interface Props {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  size?: SizeVariants;
  theme: ThemeVariants;
}

const sizeVariants: Record<SizeVariants, string> = {
  base: 'px-3 py-1',
  lg: 'px-6 py-3'
};

const themeVariants: Record<ThemeVariants, string> = {
  primary: 'bg-zinc-900 border-transparent text-white hover:bg-zinc-600',
  secondary: 'bg-transparent border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white'
};

export default function Button(props: Props) {

  function internalOnClick() {
    if (props.onClick) {
      props.onClick();
    }
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={clsx(
        'border-2 font-medium rounded-md',
        sizeVariants[props.size ?? 'base'],
        themeVariants[props.theme],
      )}
      onClick={() => internalOnClick()}>
      {props.label}
    </button>
  );
}