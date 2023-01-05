import type { ReactNode} from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import Modal from '../components/Modal';

export const ModalContext = createContext({
  open: (title: string, children: ReactNode, size?: any) => {
  }
});

export const useModal = () => useContext(ModalContext);

export interface ModalInterface {
  title: string;
  children: ReactNode;
}

interface Props {
  children?: ReactNode;
}

export default function ModalProvider(props: Props) {

  const [canRender, setCanRender] = useState(false);
  const [modal, setModal] = useState<ModalInterface | undefined>(undefined);

  useEffect(() => {
    setCanRender(true);
  }, []);

  function open(title: string, children: ReactNode): void {
    setModal({
      title,
      children
    });
  }

  function onClose(): void {
    setModal(undefined);
  }

  if (!canRender) {
    return <></>;
  }

  return (
    <ModalContext.Provider value={{
      open
    }}>
      {props.children}
      {modal && <Modal title={modal.title} onClose={onClose}>{modal.children}</Modal>}
    </ModalContext.Provider>
  );
}
