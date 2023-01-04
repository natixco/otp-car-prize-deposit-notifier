import type { ReactNode} from 'react';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { FieldError, UseFormRegister, UseFormReturn } from 'react-hook-form';

function defaultClassName() {
  return [
    'relative px-4 h-[40px] w-full sm:text-sm font-medium rounded-md bg-white border-2 border-zinc-300 focus:border-lime-500',
    'focus:border-primary placeholder:text-zinc-500 outline-none',
  ];
}

export interface PropsFormField {
  name: string;
  label?: string;
  labelChildren?: ReactNode;
  register: UseFormRegister<any>;
  error: FieldError | any;
  form?: UseFormReturn<any>;
}

interface Props {
  placeholder?: string;
  className?: string;
  focus?: boolean;
  type?: 'text';
  formField: PropsFormField;
}

export default function Input(props: Props) {

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && props.focus) {
      inputRef.current?.focus();
    }
  }, [props.focus]);

  const { name, label, labelChildren, error, register } = props.formField;
  const fieldRegister = register(name);

  return (
    <div className="mb-4 flex flex-col">
      {label && (
        <div className="flex flex-row items-center justify-between mb-1.5">
          <label className="text-sm font-medium" htmlFor={name}>{label}</label>
          {labelChildren}
        </div>
      )}
      <input {...fieldRegister}
           ref={el => {
             fieldRegister.ref(el);
             inputRef.current = el;
           }}
           id={props.formField.name}
           placeholder={props.placeholder ?? ''}
           type={props.type ?? 'text'}
           className={clsx(
             defaultClassName(),
             props.className
           )} />
      {error?.message && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}
