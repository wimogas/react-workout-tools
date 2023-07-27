import React from "react";
import {Block, Button, Modal, Text} from "react-barebones-ts";

type ConfirmDeleteProps = {
    name: string,
    setShowDeleteModal: (show: boolean) => void,
    dark: boolean,
    handleConfirmDelete: (name: string) => void,
}
const ConfirmDelete = ({name, setShowDeleteModal, dark, handleConfirmDelete}: ConfirmDeleteProps) => {

    return (
        <Modal
            dark={dark}
            close={() => setShowDeleteModal(false)}
            title={'Delete Exercise'}>
            <Text
                type={'p'}
                text={`Are you sure you want to delete ' ${name} ' ?`}/>
            <Block
                align={'center'}
                size={400}
                justify={'flex-end'}
                classes={'bb-mt-400'}>
                <Button variant={'tertiary'} dark action={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant={'danger'} dark action={() => handleConfirmDelete(name)}>Delete</Button>
            </Block>
        </Modal>
    )
}

export default ConfirmDelete;
