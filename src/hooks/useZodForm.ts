import { ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormProps } from 'react-hook-form';

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
