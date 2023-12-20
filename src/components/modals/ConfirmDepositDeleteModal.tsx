import type { Deposit } from '../../server/db/zod-schema';
import { api } from '../../utils/api';
import Button from '../Button';

export default function ConfirmDepositDeleteModal({ closeModal, deposit }: { closeModal?: any, deposit: Deposit }) {

  const utils = api.useContext();
  const deleteDepositMutation = api.deposit.delete.useMutation({
    onSuccess: () => {
      utils.deposit.getAll.invalidate();
      closeModal();
    },
    onError: (e) => {
      console.log(e);
    }
  });

  return (
    <>
      <div>
        <p className="text-zinc-700 block">Biztosan ki akarod törölni a(z) <span className="font-bold">{deposit.series} {deposit.number}</span> betéted?</p>
        <div className="mt-4 flex flex-row justify-end items-center gap-2">
          <Button theme="secondary" label="Mégse" onClick={() => closeModal()} />
          <Button theme="primary" label="Törlés"
            onClick={() => deleteDepositMutation.mutateAsync({ id: deposit.id })} />
        </div>
      </div>
    </>
  );
}