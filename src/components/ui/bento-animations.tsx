import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Zap, ArrowRight, Command } from 'lucide-react';

// Color Palette Constants
const COLORS = {
    black: '#000000', // 35%
    white: '#FFFFFF', // 60%
    purple: '#A855F7', // 5% (using a vibrant purple)
    darkGray: '#1A1A1A',
    lightGray: '#F5F5F5',
};

export const CalendarAnimation = () => {
    return (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black" />

            {/* Floating Event Cards */}
            <div className="relative z-10 w-full max-w-[280px] space-y-3">
                {[
                    { time: '09:00', title: 'Design Review', color: 'bg-purple-500' },
                    { time: '11:30', title: 'Team Standup', color: 'bg-purple-400' },
                    { time: '14:00', title: 'Client Call', color: 'bg-purple-600' },
                ].map((event, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.3, duration: 0.5 }}
                        className="bg-neutral-900/60 backdrop-blur border border-neutral-800 p-4 rounded-lg flex items-center gap-3"
                    >
                        <div className={`w-1 h-12 ${event.color} rounded-full`} />
                        <div className="flex-1">
                            <div className="text-xs text-neutral-500 mb-1">{event.time}</div>
                            <div className="text-sm font-medium text-neutral-200">{event.title}</div>
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                            className="w-2 h-2 rounded-full bg-purple-500"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Animated Timeline */}
            <motion.div
                className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
            />
        </div>
    );
};

export const TaskConsolidationAnimation = () => {
    const tasks = [
        { icon: 'mail', text: 'Email from Sarah', source: 'Gmail' },
        { icon: 'slack', text: 'Design Review', source: 'Slack' },
        { icon: 'jira', text: 'Fix Navigation Bug', source: 'Jira' },
    ];

    return (
        <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

            <div className="relative z-10 w-full max-w-[240px] space-y-3">
                {tasks.map((task, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="bg-neutral-900/80 backdrop-blur border border-neutral-800 p-3 rounded-lg flex items-center gap-3"
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${i === 0 ? 'bg-red-500/20 text-red-400' :
                                i === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-blue-500/20 text-blue-400'}`}
                        >
                            <CheckCircle2 size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-neutral-200 truncate">{task.text}</div>
                            <div className="text-[10px] text-neutral-500">{task.source}</div>
                        </div>
                        <ArrowRight size={14} className="text-purple-500" />
                    </motion.div>
                ))}
            </div>

            {/* Funnel Effect */}
            <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"
                animate={{ height: ['0%', '100%'], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </div>
    );
};

export const CommandBarAnimation = () => {
    const commands = ['Create Task', 'New Project', 'Add Meeting', 'Set Reminder'];

    return (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-black" />

            {/* Command Bar */}
            <div className="relative z-10 w-full max-w-[280px]">
                <div className="bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-lg overflow-hidden shadow-2xl">
                    <div className="p-3 border-b border-neutral-800 flex items-center gap-2">
                        <Command className="w-4 h-4 text-purple-400" />
                        <motion.div
                            className="flex-1 text-sm text-neutral-400"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Type a command...
                        </motion.div>
                        <div className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500">⌘K</div>
                    </div>

                    <div className="p-2">
                        {commands.map((cmd, i) => (
                            <motion.div
                                key={cmd}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: [0.4, 1, 0.4], x: 0 }}
                                transition={{
                                    opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 },
                                    x: { duration: 0.3 }
                                }}
                                className="flex items-center gap-2 p-2 text-sm text-neutral-300"
                            >
                                <div className="w-1 h-1 rounded-full bg-purple-500" />
                                {cmd}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Keyboard Shortcuts */}
                <motion.div
                    className="mt-4 flex gap-2 justify-center"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    {['⌘', 'K'].map((key, i) => (
                        <div key={i} className="w-8 h-8 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded flex items-center justify-center text-sm font-mono">
                            {key}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export const FocusModeAnimation = () => {
    return (
        <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center overflow-hidden">
            {/* Distractions (Blurred Background) */}
            <div className="absolute inset-0 grid grid-cols-3 gap-4 p-4 opacity-20 blur-sm">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="bg-neutral-800 rounded-lg h-full w-full" />
                ))}
            </div>

            {/* Spotlight */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Focused Item */}
            <div className="relative z-10 bg-black border border-neutral-800 p-6 rounded-2xl shadow-2xl shadow-purple-900/20 max-w-[200px] text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Zap className="text-white fill-white" size={24} />
                </div>
                <h4 className="text-white font-bold mb-1">Deep Work</h4>
                <div className="h-1 w-16 bg-neutral-800 mx-auto rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-purple-500"
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </div>
        </div>
    );
};

export const AutomationsAnimation = () => {
    const nodes = [
        { id: 1, x: 60, y: 50, label: 'Email' },
        { id: 2, x: 150, y: 30, label: 'Filter' },
        { id: 3, x: 150, y: 70, label: 'Task' },
        { id: 4, x: 240, y: 50, label: 'Notify' },
    ];

    return (
        <div className="absolute inset-0 bg-black flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black" />

            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                    <motion.line
                        x1="80" y1="50%" x2="140" y2="40%"
                        stroke="#a855f7"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, 8] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.line
                        x1="80" y1="50%" x2="140" y2="60%"
                        stroke="#a855f7"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, 8] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.line
                        x1="170" y1="40%" x2="220" y2="50%"
                        stroke="#a855f7"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, 8] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.line
                        x1="170" y1="60%" x2="220" y2="50%"
                        stroke="#a855f7"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        animate={{ strokeDashoffset: [0, 8] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                </svg>

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <motion.div
                        key={node.id}
                        className="absolute bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300"
                        style={{ left: `${node.x}px`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                        animate={{
                            scale: [1, 1.05, 1],
                            borderColor: ['#262626', '#a855f7', '#262626']
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                        {node.label}
                    </motion.div>
                ))}

                {/* Flowing Particles */}
                {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-purple-500 rounded-full"
                        style={{ left: '80px', top: '50%' }}
                        animate={{
                            left: ['80px', '240px'],
                            top: ['50%', `${40 + i * 10}%`],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                    />
                ))}
            </div>
        </div>
    );
};
