'use client';

import React, { useState, DragEvent, ChangeEvent } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (file: File) => Promise<void>;
}

type ImportState = 'idle' | 'uploading' | 'success' | 'error';

export const ImportModal = ({ isOpen, onClose, onImport }: ImportModalProps) => {
    const [dragActive, setDragActive] = useState(false);
    const [importState, setImportState] = useState<ImportState>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('File input changed:', e.target.files);
        if (e.target.files && e.target.files[0]) {
            console.log('File selected:', e.target.files[0].name);
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.json')) {
            setErrorMessage('Please select a JSON file');
            setImportState('error');
            return;
        }

        setImportState('uploading');
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await onImport(file);
            setSuccessMessage(`Successfully imported "${file.name}"`);
            setImportState('success');

            // Auto close after 2 seconds
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Import failed');
            setImportState('error');
        }
    };

    const handleClose = () => {
        setImportState('idle');
        setErrorMessage('');
        setSuccessMessage('');
        setDragActive(false);
        onClose();
    };

    const renderContent = () => {
        switch (importState) {
            case 'uploading':
                return (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
                        <p className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>Importing file...</p>
                        <p className="text-sm mt-2" style={{ color: 'var(--color-textSecondary)' }}>Please wait while we process your form</p>
                    </div>
                );

            case 'success':
                return (
                    <div className="text-center py-8">
                        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--color-success)' }} />
                        <p className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>Import Successful!</p>
                        <p className="text-sm mt-2" style={{ color: 'var(--color-textSecondary)' }}>{successMessage}</p>
                    </div>
                );

            case 'error':
                return (
                    <div className="text-center py-8">
                        <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--color-error)' }} />
                        <p className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>Import Failed</p>
                        <p className="text-sm mt-2" style={{ color: 'var(--color-textSecondary)' }}>{errorMessage}</p>
                        <Button variant="primary" onClick={() => setImportState('idle')} className="mt-4">
                            Try Again
                        </Button>
                    </div>
                );

            default:
                return (
                    <div className="py-6">
                        <div className="text-center mb-6">
                            <Upload size={48} className="mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
                            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Import Form Configuration</h3>
                            <p className="text-sm mt-2" style={{ color: 'var(--color-textSecondary)' }}>
                                Select a JSON file to import your form configuration
                            </p>
                        </div>

                        <div
                            className={`border-2 border-dashed rounded-lg p-4 lg:p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                                }`}
                            style={{
                                borderColor: dragActive ? 'var(--color-primary)' : 'var(--color-border)',
                                backgroundColor: dragActive ? 'var(--color-primary)' + '10' : 'transparent'
                            }}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <Upload size={32} className="mx-auto mb-4" style={{ color: 'var(--color-textSecondary)' }} />
                            <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                                {dragActive ? 'Drop your file here' : 'Drag & drop your JSON file here'}
                            </p>
                            <p className="text-sm mb-4" style={{ color: 'var(--color-textSecondary)' }}>
                                or
                            </p>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileInput}
                                className="hidden"
                                id="file-input-modal"
                                ref={(input) => {
                                    if (input) {
                                        // Store reference for programmatic access
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        (window as any).fileInputModal = input;
                                    }
                                }}
                            />
                            <Button
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => {
                                    console.log('Choose File button clicked');
                                    const fileInput = document.getElementById('file-input-modal') as HTMLInputElement;
                                    console.log('File input found:', fileInput);
                                    if (fileInput) {
                                        fileInput.click();
                                        console.log('File input clicked programmatically');
                                    } else {
                                        console.error('File input not found!');
                                    }
                                }}
                            >
                                Choose File
                            </Button>
                        </div>

                        <div className="mt-4 text-xs" style={{ color: 'var(--color-textSecondary)' }}>
                            <p>Supported format: JSON files exported from this form builder</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Import Form" size="md">
            {renderContent()}
        </Modal>
    );
};
