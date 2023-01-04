import type { ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UseFormProps } from 'react-hook-form';
import { useForm } from 'react-hook-form';

export function useZodForm<TSchema extends ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema;
  }
) {
  return useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined)
  });
}
