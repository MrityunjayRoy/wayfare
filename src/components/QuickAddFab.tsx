'use client';

import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

interface QuickAddFabProps {
    onClick: () => void;
}

export default function QuickAddFab({ onClick }: QuickAddFabProps) {
    return (
        <motion.button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 text-white shadow-fab flex items-center justify-center cursor-pointer hover:shadow-elevated transition-shadow duration-300"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            animate={{
                boxShadow: [
                    '0 6px 20px rgba(95, 138, 95, 0.3)',
                    '0 6px 28px rgba(95, 138, 95, 0.5)',
                    '0 6px 20px rgba(95, 138, 95, 0.3)',
                ],
            }}
            transition={{
                boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                scale: { type: 'spring', stiffness: 400, damping: 17 },
                rotate: { type: 'spring', stiffness: 200, damping: 15 },
            }}
        >
            <FiPlus size={24} strokeWidth={2.5} />
        </motion.button>
    );
}
