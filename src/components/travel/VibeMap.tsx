'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Memory } from '@/lib/types';
import {
    startOfYear,
    endOfYear,
    eachDayOfInterval,
    format,
    getDay,
    differenceInWeeks,
    startOfWeek,
    getYear,
} from 'date-fns';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface VibeMapProps {
    memories: Memory[];
    onDateClick: (date: string) => void;
}

export default function VibeMap({ memories, onDateClick }: VibeMapProps) {
    // Determine available years from memories
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        years.add(getYear(new Date())); // always include current year
        memories.forEach((m) => {
            years.add(getYear(new Date(m.assigned_date)));
        });
        return Array.from(years).sort((a, b) => b - a); // newest first
    }, [memories]);

    const [selectedYear, setSelectedYear] = useState(() => getYear(new Date()));

    const { cells, months, totalMemories } = useMemo(() => {
        const yearDate = new Date(selectedYear, 0, 1);
        const yearStart = startOfYear(yearDate);
        const yearEnd = endOfYear(yearDate);
        const days = eachDayOfInterval({ start: yearStart, end: yearEnd });

        // Count memories per day
        const counts: Record<string, number> = {};
        let total = 0;
        memories.forEach((m) => {
            const d = new Date(m.assigned_date);
            if (getYear(d) === selectedYear) {
                const dateKey = format(d, 'yyyy-MM-dd');
                counts[dateKey] = (counts[dateKey] || 0) + 1;
                total++;
            }
        });

        const maxCount = Math.max(1, ...Object.values(counts));

        // Build cells
        const weekStart = startOfWeek(yearStart, { weekStartsOn: 0 });
        const cellData = days.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const count = counts[dateKey] || 0;
            const weekIndex = differenceInWeeks(day, weekStart);
            const dayIndex = getDay(day);
            return { date: day, dateKey, count, weekIndex, dayIndex, intensity: count / maxCount };
        });

        // Month labels
        const monthLabels: { label: string; weekIndex: number }[] = [];
        let lastMonth = -1;
        cellData.forEach((cell) => {
            const month = cell.date.getMonth();
            if (month !== lastMonth) {
                lastMonth = month;
                monthLabels.push({
                    label: format(cell.date, 'MMM'),
                    weekIndex: cell.weekIndex,
                });
            }
        });

        return { cells: cellData, months: monthLabels, totalMemories: total };
    }, [memories, selectedYear]);

    const getColor = (intensity: number, count: number) => {
        if (count === 0) return 'bg-sage-100/50';
        if (intensity <= 0.25) return 'bg-sage-200';
        if (intensity <= 0.5) return 'bg-sage-300';
        if (intensity <= 0.75) return 'bg-sage-400';
        return 'bg-sage-500';
    };

    const navigateYear = (dir: number) => {
        setSelectedYear((prev) => prev + dir);
    };

    const cellSize = 14;
    const gap = 3;

    return (
        <div className="w-full bg-white/50 backdrop-blur-sm rounded-2xl p-5 shadow-soft border border-sage-100/30">
            {/* Header with year navigation */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 tracking-wide">
                    ✧ Vibe Map
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                        {totalMemories} {totalMemories === 1 ? 'memory' : 'memories'}
                    </span>
                    <div className="flex items-center gap-1 bg-cream-100 rounded-full px-1 py-0.5">
                        <button
                            onClick={() => navigateYear(-1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-sage-600 hover:bg-sage-100 transition-colors cursor-pointer"
                        >
                            <FiChevronLeft size={12} />
                        </button>
                        <span className="text-xs font-semibold text-slate-600 min-w-[36px] text-center">
                            {selectedYear}
                        </span>
                        <button
                            onClick={() => navigateYear(1)}
                            disabled={selectedYear >= getYear(new Date())}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${selectedYear >= getYear(new Date())
                                    ? 'text-slate-200 cursor-not-allowed'
                                    : 'text-slate-400 hover:text-sage-600 hover:bg-sage-100'
                                }`}
                        >
                            <FiChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Year quick-jump pills */}
            {availableYears.length > 1 && (
                <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                    {availableYears.map((year) => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer ${year === selectedYear
                                    ? 'bg-sage-500 text-white shadow-sm'
                                    : 'bg-sage-50 text-slate-500 hover:bg-sage-100 hover:text-sage-700'
                                }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            )}

            <div className="overflow-x-auto pb-2">
                <div className="min-w-fit">
                    {/* Month labels */}
                    <div className="flex mb-2 ml-8">
                        {months.map((m, i) => (
                            <div
                                key={i}
                                className="text-[10px] text-slate-400 font-medium"
                                style={{
                                    position: 'relative',
                                    left: `${m.weekIndex * (cellSize + gap)}px`,
                                    width: 0,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {m.label}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-0.5">
                        {/* Day labels */}
                        <div className="flex flex-col justify-around pr-2 shrink-0" style={{ height: 7 * (cellSize + gap) - gap }}>
                            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                                <span key={i} className="text-[9px] text-slate-400 leading-none h-[14px] flex items-center">
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="relative" style={{ height: 7 * (cellSize + gap) - gap }}>
                            {cells.map((cell) => (
                                <motion.button
                                    key={cell.dateKey}
                                    whileHover={{ scale: 1.4 }}
                                    onClick={() => cell.count > 0 && onDateClick(cell.dateKey)}
                                    className={`absolute rounded-[3px] transition-colors duration-150 cursor-pointer ${getColor(
                                        cell.intensity,
                                        cell.count
                                    )} ${cell.count > 0 ? 'hover:ring-2 hover:ring-sage-400/50' : ''}`}
                                    style={{
                                        width: cellSize,
                                        height: cellSize,
                                        left: cell.weekIndex * (cellSize + gap),
                                        top: cell.dayIndex * (cellSize + gap),
                                    }}
                                    title={`${format(cell.date, 'MMM d, yyyy')}: ${cell.count} ${cell.count === 1 ? 'memory' : 'memories'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1.5 mt-3">
                <span className="text-[10px] text-slate-400">Less</span>
                {['bg-sage-100/50', 'bg-sage-200', 'bg-sage-300', 'bg-sage-400', 'bg-sage-500'].map((color, i) => (
                    <div key={i} className={`w-3 h-3 rounded-[2px] ${color}`} />
                ))}
                <span className="text-[10px] text-slate-400">More</span>
            </div>
        </div>
    );
}
