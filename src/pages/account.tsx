import Header from "../components/Header";
import { api } from "../utils/api";
import { useState } from "react";

export default function Account() {

  const utils = api.useContext();
  const { data } = api.deposit.getAll.useQuery();
  const addDepositMutation = api.deposit.add.useMutation({
    onSuccess: () => {
      utils.deposit.getAll.invalidate();
    },
    onError: (e) => {
      console.log(e)
    }
  });
  const [series, setSeries] = useState('');
  const [number, setNumber] = useState('');

  return (
    <>
      <Header />
      <div className="main-container">
        <input type="text" value={series} onChange={e => setSeries(e.target.value)}/>
        <input type="text" value={number} onChange={e => setNumber(e.target.value)}/>
        <button onClick={() => addDepositMutation.mutateAsync({
          series,
          number,
        })}>add</button>
        <div className="grid grid-cols-4 grid-rows-[50px] gap-2">
          {data?.map(item => {
            return (
              <div key={item.series} className="flex flex-row items-center justify-between bg-gray-100 p-4 rounded-md">
                <p className="text-lg font-medium text-zinc-800">
                  {item.series} {item.number}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}