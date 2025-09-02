import React, { useState } from 'react'
import '../../Modals/ModalStyle.css'
import { useNavigate } from 'react-router-dom'
import MultipleProduct from '../../../Pages/NewProduct/MultipleProduct/MultipleProduct';

const AddProductModal = ({ onClose }) => {
    const nav = useNavigate();
    const [showMultiple, setShowMultiple] = useState(false);

    return (
        <>
            <div className='modal-overlay' onClick={onClose}>
                <div className='modal-card' onClick={(e) => e.stopPropagation()}>
                    <div className='modal-actions'>
                        <button
                            className='modal-btn'
                            onClick={() => { onClose(); nav("/product/new"); }}
                        >
                            Individual product
                        </button>

                        <button
                            className='modal-btn'
                            onClick={() => { setShowMultiple(true); }}
                        >
                            Multiple product
                        </button>
                    </div>
                </div>
            </div>

            {showMultiple && (
                <MultipleProduct
                    onClose={() => setShowMultiple(false)}
                    onUploaded={() => window.location.reload()}
                />
            )}
        </>
    );
};

export default AddProductModal
