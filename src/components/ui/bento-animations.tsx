
import { CheckCircle2, Zap, ArrowRight, Command } from 'lucide-react';

// Color Palette Constants


export const CalendarAnimation = () => {
    return (
        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black" />

            {/* Event Cards */}
            <div className="relative z-10 w-full max-w-[280px] space-y-3">
                {[
                    { time: '09:00', title: 'Design Review', color: 'bg-purple-500' },
                    { time: '11:30', title: 'Team Standup', color: 'bg-purple-400' },
                    { time: '14:00', title: 'Client Call', color: 'bg-purple-600' },
                ].map((event, i) => (
                    <div
                        key={i}
                        className="bg-neutral-900/60 backdrop-blur border border-neutral-800 p-4 rounded-lg flex items-center gap-3"
                    >
                        <div className={`w-1 h-12 ${event.color} rounded-full`} />
                        <div className="flex-1">
                            <div className="text-xs text-neutral-500 mb-1">{event.time}</div>
                            <div className="text-sm font-medium text-neutral-200">{event.title}</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />
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
                    <div
                        key={i}
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
                    </div>
                ))}
            </div>

            {/* Funnel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
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
                        <div className="flex-1 text-sm text-neutral-400">
                            Type a command...
                        </div>
                        <div className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500">⌘K</div>
                    </div>

                    <div className="p-2">
                        {commands.map((cmd, i) => (
                            <div
                                key={cmd}
                                className="flex items-center gap-2 p-2 text-sm text-neutral-300"
                            >
                                <div className="w-1 h-1 rounded-full bg-purple-500" />
                                {cmd}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="mt-4 flex gap-2 justify-center">
                    {['⌘', 'K'].map((key, i) => (
                        <div key={i} className="w-8 h-8 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded flex items-center justify-center text-sm font-mono">
                            {key}
                        </div>
                    ))}
                </div>
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

            {/* Focused Item */}
            <div className="relative z-10 bg-black border border-neutral-800 p-6 rounded-2xl shadow-2xl shadow-purple-900/20 max-w-[200px] text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Zap className="text-white fill-white" size={24} />
                </div>
                <h4 className="text-white font-bold mb-1">Deep Work</h4>
                <div className="h-1 w-16 bg-neutral-800 mx-auto rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-full" />
                </div>
            </div>
        </div>
    );
};

export const AutomationsAnimation = () => {
    return (
        <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-black" />

            <div className="relative w-full h-full flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <radialGradient id="lotusGradient">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="50%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </radialGradient>
                        <radialGradient id="petalGradient">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                        </radialGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Central Sacred Geometry */}
                    <g transform="translate(200, 200)">
                        {/* Outer Ring Pattern */}
                        {[...Array(12)].map((_, i) => {
                            const angle = (i * 30 * Math.PI) / 180;
                            const radius = 80;
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;
                            return (
                                <circle
                                    key={`geo-${i}`}
                                    cx={x}
                                    cy={y}
                                    r="3"
                                    fill="url(#lotusGradient)"
                                    filter="url(#glow)"
                                    opacity="0.6"
                                />
                            );
                        })}

                        {/* Lotus Petals - Outer Layer */}
                        {[...Array(8)].map((_, i) => {
                            const angle = (i * 45);
                            return (
                                <g key={`petal-outer-${i}`} transform={`rotate(${angle})`}>
                                    <path
                                        d="M 0 0 Q 15 -50 0 -90 Q -15 -50 0 0"
                                        fill="url(#petalGradient)"
                                        stroke="#e9d5ff"
                                        strokeWidth="1"
                                        filter="url(#glow)"
                                    />
                                </g>
                            );
                        })}

                        {/* Lotus Petals - Middle Layer */}
                        {[...Array(8)].map((_, i) => {
                            const angle = (i * 45) + 22.5;
                            return (
                                <g key={`petal-mid-${i}`} transform={`rotate(${angle})`}>
                                    <path
                                        d="M 0 0 Q 12 -35 0 -65 Q -12 -35 0 0"
                                        fill="#a855f7"
                                        fillOpacity="0.7"
                                        stroke="#d8b4fe"
                                        strokeWidth="1"
                                        filter="url(#glow)"
                                    />
                                </g>
                            );
                        })}

                        {/* Inner Petals */}
                        {[...Array(6)].map((_, i) => {
                            const angle = (i * 60);
                            return (
                                <g key={`petal-inner-${i}`} transform={`rotate(${angle})`}>
                                    <path
                                        d="M 0 0 Q 8 -20 0 -40 Q -8 -20 0 0"
                                        fill="#ec4899"
                                        fillOpacity="0.6"
                                        stroke="#fbbf24"
                                        strokeWidth="0.5"
                                        filter="url(#glow)"
                                    />
                                </g>
                            );
                        })}

                        {/* Central Core */}
                        <circle
                            r="12"
                            fill="url(#lotusGradient)"
                            filter="url(#glow)"
                            opacity="0.95"
                        />

                        {/* Energy Particles - Static */}
                        {[...Array(8)].map((_, i) => {
                            const orbitRadius = 100;
                            const x = Math.cos((i * 45 * Math.PI) / 180) * orbitRadius;
                            const y = Math.sin((i * 45 * Math.PI) / 180) * orbitRadius;
                            return (
                                <circle
                                    key={`particle-${i}`}
                                    cx={x}
                                    cy={y}
                                    r="2"
                                    fill="#fff"
                                    filter="url(#glow)"
                                    opacity="0.5"
                                />
                            );
                        })}

                        {/* Floating Particles - Static */}
                        {[...Array(12)].map((_, i) => {
                            const angle = (i * 137.5) * (Math.PI / 180);
                            const dist = 40 + (i * 12);
                            const x = Math.cos(angle) * dist;
                            const y = Math.sin(angle) * dist;

                            return (
                                <circle
                                    key={`float-${i}`}
                                    cx={x}
                                    cy={y}
                                    r="1.5"
                                    fill="#d8b4fe"
                                    opacity="0.4"
                                />
                            );
                        })}
                    </g>
                </svg>
            </div>
        </div>
    );
};
