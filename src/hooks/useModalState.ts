import { useState } from 'react';

interface ModalState {
    [key: string]: boolean;
}

export const useModalState = (initialModals: ModalState) => {
    const [modals, setModals] = useState(initialModals);

    const openModal = (modalName: string) => {
        setModals(prev => ({ ...prev, [modalName]: true }));
    };

    const closeModal = (modalName: string) => {
        setModals(prev => ({ ...prev, [modalName]: false }));
    };

    const toggleModal = (modalName: string) => {
        setModals(prev => ({ ...prev, [modalName]: !prev[modalName] }));
    };

    return { modals, openModal, closeModal, toggleModal };
};


