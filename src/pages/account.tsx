import Header from '../components/Header';
import { api } from '../utils/api';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { Deposit } from '@prisma/client';
import { DepositStatus } from '@prisma/client';
import clsx from 'clsx';
import Button from '../components/Button';
import { useModal } from '../providers/ModalProvider';
import NewDepositModal from '../components/modals/NewDepositModal';
import Head from 'next/head';
import ConfirmDepositDeleteModal from '../components/modals/ConfirmDepositDeleteModal';

interface GridProps {
  title: string;
  data: Deposit[];
  emptyDataText: string;
  type: 'won' | 'pending';
  children?: ReactNode;
}

function Grid(props: GridProps) {

  const modal = useModal();

  return (
    <div className="mb-14">
      <div className="flex flex-row items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-zinc-800">{props.title}</h2>
        {props.children}
      </div>
      {props.data?.length === 0 ? <p className="text-zinc-600">{props.emptyDataText}</p> : (
        <div className={clsx(
          'p-4 rounded-lg drop-shadow',
          props.type === 'won' ? 'bg-gradient-to-br from-lime-500 to-green-500' : 'bg-white'
        )}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-[1fr] gap-4">
            {props.data.map(item => {
              return (
                <div key={item.id}
                     className={clsx(
                       'flex flex-row items-center py-2 px-4 rounded-md bg-gray-100',
                       props.type === 'pending' ? 'justify-between' : 'justify-center'
                     )}>
                  <p className="text-lg font-semibold text-zinc-900">
                    {item.series} {item.number}
                  </p>
                  {props.type === 'pending' &&
                    <button className="p-2 group" onClick={() => modal.open('Betét törlése', <ConfirmDepositDeleteModal deposit={item}/>)}>
                      <TrashIcon className="h-5 w-5 text-zinc-500 group-hover:text-red-500" />
                    </button>
                  }
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Account() {

  const { data } = api.deposit.getAll.useQuery();
  const modal = useModal();
  const [pendingDeposits, setPendingDeposits] = useState<Deposit[]>([]);
  const [wonDeposits, setWonDeposits] = useState<Deposit[]>([]);

  useEffect(() => {
    setWonDeposits(data?.filter(item => item.status === DepositStatus.Won) ?? []);
    setPendingDeposits(data?.filter(item => item.status === DepositStatus.Pending) ?? []);
  }, [data]);

  return (
    <>
      <Head>
        <title>Profil</title>
      </Head>
      <Header />
      <div className="main-container relative">
        <Grid title="Nyertes betétek" data={wonDeposits} emptyDataText="Még nem nyertél :(" type="won" />
        <Grid title="Betétek" data={pendingDeposits} emptyDataText="Még nincsenek betéteid" type="pending">
          <Button label="Új hozzáadása"
                  theme="primary"
                  onClick={() => modal.open('Új betét', <NewDepositModal />)} />
        </Grid>
      </div>
    </>
  );
}