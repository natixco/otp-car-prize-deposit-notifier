import { Dialog, Transition } from '@headlessui/react';
import React, { FC, Fragment, ReactNode, useState } from 'react';
import clsx from 'clsx';

interface Props {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export const Modal: FC<Props> = (props) => {

  const [open, setOpen] = useState(true);

  function closeModal() {
    setOpen(false);
    setTimeout(() => props.onClose(), 200);
  }

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-zinc-200 bg-opacity-50"/>
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full transform rounded-2xl bg-white p-6 text-left align-middle shadow-md transition-all max-w-md">
                  <Dialog.Title
                    as="h3"
                    className="mb-4 text-lg font-bold"
                  >
                    {props.title}
                  </Dialog.Title>
                  <div>
                    {React.Children.map(props.children, (child: any) =>
                      React.cloneElement(child, {
                        closeModal
                      })
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
