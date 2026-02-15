'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MemoryProvider, useMemory } from '@/context/MemoryContext';
import Header from '@/components/Header';
import TravelView from '@/components/travel/TravelView';
import StaticView from '@/components/static/StaticView';
import QuickAddFab from '@/components/QuickAddFab';
import AddMemoryModal from '@/components/AddMemoryModal';
import ConfirmDialog from '@/components/ConfirmDialog';

function MainContent() {
    const { state, addMemory, deleteMemory, setViewMode } = useMemory();
    const [showModal, setShowModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const handleDeleteRequest = useCallback((id: string) => {
        setDeleteTarget(id);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (deleteTarget) {
            const id = deleteTarget;
            setDeleteTarget(null);
            await deleteMemory(id);
        }
    }, [deleteTarget, deleteMemory]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteTarget(null);
    }, []);

    return (
        <div className="min-h-screen bg-cream-50 dark:bg-dark-50 transition-colors duration-300">
            <Header mode={state.viewMode} onModeChange={setViewMode} />

            <main className="relative">
                <AnimatePresence mode="wait">
                    {state.viewMode === 'travel' ? (
                        <motion.div
                            key="travel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <TravelView
                                memories={state.memories}
                                onDelete={handleDeleteRequest}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="static"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <StaticView
                                memories={state.memories}
                                onDelete={handleDeleteRequest}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <QuickAddFab onClick={() => setShowModal(true)} />

            <AddMemoryModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={addMemory}
            />

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                title="Delete Memory"
                message="Are you sure you want to delete this memory? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Keep"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
}

export default function Home() {
    return (
        <MemoryProvider>
            <MainContent />
        </MemoryProvider>
    );
}
