import { z } from 'zod';
import { useZodForm } from '../../hooks/useZodForm';
import Button from '../Button';
import { api } from '../../utils/api';
import Input from '../Input';
import { useState } from 'react';

const newDepositSchema = z.object({
  series: z.string().min(2, 'Kötelező').max(2, 'Max 2 szám'),
  number: z.string().min(7, 'Kötelező').max(7, 'Max 7 szám'),
});

type NewDepositSchema = z.infer<typeof newDepositSchema>;

export default function NewDepositModal({ closeModal }: any) {
  const form = useZodForm({
    schema: newDepositSchema,
  });

  const utils = api.useContext();
  const [error, setError] = useState('');
  const addDepositMutation = api.deposit.add.useMutation({
    onSuccess: () => {
      utils.deposit.getAll.invalidate();
      closeModal();
    },
    onError: (e) => {
      setError(e.message);
    }
  });

  return (
    <>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form
        onSubmit={form.handleSubmit((values: NewDepositSchema) => addDepositMutation.mutate(values))}
      >
        <div className="grid grid-rows-2 sm:grid-rows-1 grid-cols-1 sm:grid-cols-[1fr_4fr] gap-2">
          <Input
            formField={{
              name: 'series',
              label: 'Sorozat',
              register: form.register,
              error: form.formState.errors.series
            }}
            focus={true}/>
          <Input
            formField={{
              name: 'number',
              label: 'Sorszám',
              register: form.register,
              error: form.formState.errors.number
            }}/>
        </div>
        <div className="mt-4 flex flex-row justify-end items-center gap-2">
          <Button theme="secondary" label="Mégse" onClick={() => closeModal()}/>
          <Button theme="primary" label="Hozzáad" type="submit"/>
        </div>
      </form>
    </>
  );
}