// Apply saved theme preference across pages
(function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
})();

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    renderAcademicPlots();
}

function renderAcademicPlots() {
    if (typeof Plotly === 'undefined') return;

    const isDark = document.documentElement.classList.contains('dark');
    const fg = isDark ? '#b0b6c6' : '#5a5e6b';
    const grid = isDark ? '#363b49' : '#e2dfd5';
    const pastelBlue = isDark ? '#93b8f8' : '#5b82c4';
    const pastelGreen = isDark ? '#88cfa8' : '#48997a';
    const pastelWarm = isDark ? '#f2b880' : '#c9834b';

    const baseLayout = (title, xL, yL) => ({
        title: { text: title, font: { family: 'Plus Jakarta Sans, sans-serif', size: 12, color: fg } },
        margin: { t: 34, b: 36, l: 48, r: 14 },
        xaxis: { title: { text: xL, font: { size: 11 } }, color: fg, gridcolor: grid, zerolinecolor: grid },
        yaxis: { title: { text: yL, font: { size: 11 } }, color: fg, gridcolor: grid, zerolinecolor: grid },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        legend: { font: { size: 10, color: fg }, bgcolor: 'transparent', x: 0.02, y: 0.98 }
    });

    if (document.getElementById('plot-traffic-fd')) {
        const vf = 15, rhoMax = 0.15, rhoC = 0.075, qMax = 0.5625;
        const rhos = [], D = [], S = [];
        for (let r = 0; r <= rhoMax + 1e-5; r += 0.0025) {
            rhos.push(r);
            const q = vf * r * (1 - r / rhoMax);
            D.push(r <= rhoC ? q : qMax);
            S.push(r <= rhoC ? qMax : q);
        }
        Plotly.newPlot('plot-traffic-fd', [
            { x: rhos, y: D, mode: 'lines', name: 'Demand D(ρ)', line: { color: pastelBlue, width: 2.5 } },
            { x: rhos, y: S, mode: 'lines', name: 'Supply S(ρ)', line: { color: pastelWarm, width: 2.5, dash: 'dash' } }
        ], baseLayout('Greenshields Demand D(ρ) & Supply S(ρ)', 'Density ρ [veh/m]', 'Flux q [veh/s]'), { responsive: true, displayModeBar: false });
    }

    if (document.getElementById('plot-traffic-tts')) {
        Plotly.newPlot('plot-traffic-tts', [
            { x: ['1×1', '2×2', '3×3', '4×4', '6×6'], y: [-7.5, -10.3, -15.4, -19.4, -16.4], type: 'bar', name: 'Medium Load', marker: { color: pastelBlue } },
            { x: ['1×1', '2×2', '3×3', '4×4', '6×6'], y: [9.5, -15.8, -10.2, -17.0, -17.0], type: 'bar', name: 'Heavy Load', marker: { color: pastelGreen } }
        ], { ...baseLayout('RL Delay (TTS) Change vs Actuated (6 Seeds)', 'Grid Size', 'TTS Change [%]'), barmode: 'group' }, { responsive: true, displayModeBar: false });
    }

    if (document.getElementById('plot-options-tree')) {
        const paths = [1e3, 5e3, 2e4, 1e5, 5e5, 1e6];
        const mcEst = [10.61, 10.52, 10.49, 10.46, 10.47, 10.47];
        const analytic = paths.map(() => 10.45);
        const layout = baseLayout('Monte Carlo Validation (10.45 Analytic vs 10.47 ± 0.01)', 'Paths M (log)', 'Call Price C₀');
        layout.xaxis.type = 'log';
        layout.yaxis.range = [10.30, 10.72];
        Plotly.newPlot('plot-options-tree', [
            { x: paths, y: mcEst, mode: 'lines+markers', marker: { size: 6 }, name: 'MC Estimate (10.47 ± 0.01)', line: { color: pastelGreen, width: 2.5 } },
            { x: paths, y: analytic, mode: 'lines', name: 'Black–Scholes Analytic (10.45)', line: { color: pastelWarm, width: 2, dash: 'dot' } }
        ], layout, { responsive: true, displayModeBar: false });
    }

    if (document.getElementById('plot-options-mc')) {
        const rebalances = [4, 8, 16, 32, 64, 128, 252];
        const simStd = [4.28, 3.05, 2.18, 1.55, 1.10, 0.78, 0.56];
        const theoryStd = rebalances.map(n => 8.68 / Math.sqrt(n));
        const hedgeLayout = baseLayout('Discrete Delta-Hedging Error vs Rebalances N (Slope −0.49)', 'Rebalances N (log)', 'Hedging Error Std (log)');
        hedgeLayout.xaxis.type = 'log';
        hedgeLayout.yaxis.type = 'log';
        Plotly.newPlot('plot-options-mc', [
            { x: rebalances, y: simStd, mode: 'lines+markers', marker: { size: 6 }, name: 'Simulated (Slope −0.49)', line: { color: pastelBlue, width: 2.5 } },
            { x: rebalances, y: theoryStd, mode: 'lines', name: 'Analytic O(N⁻¹/²)', line: { color: pastelWarm, width: 2, dash: 'dash' } }
        ], hedgeLayout, { responsive: true, displayModeBar: false });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderAcademicPlots();
});


/* ==========================================================================
   GAMECUBE CRAZY TAXI 3D PORTFOLIO & ARCADE ENGINE
   ========================================================================== */

const CT_DRIVER_LICENSE = {
    badge: 'OFFICIAL CRAZY CAB DRIVER LICENSE · CLASS S',
    title: 'DRIVER: DENIZ COBAN (ABOUT ME)',
    html: `
        <div class="p-3.5 mb-3 rounded-xl bg-yellow-400/10 border-2 border-yellow-400/60 flex flex-wrap items-center justify-between gap-3">
            <div>
                <div class="text-xs font-extrabold uppercase tracking-wider text-yellow-300">LICENSE NO: UOM-MMATH-2026</div>
                <div class="text-base font-bold text-white">Deniz Coban · MMath Mathematics @ University of Manchester</div>
            </div>
            <span class="px-2.5 py-1 rounded bg-yellow-400 text-black font-extrabold text-xs">CLASS S DRIVER</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 rounded-lg bg-black/50 border-2 border-blue-400">
                <div class="font-extrabold text-blue-300 uppercase mb-1.5">Mathematical Focus</div>
                <ul class="space-y-1 text-slate-200">
                    <li>• Conservation PDEs &amp; Riemann Problems</li>
                    <li>• Black–Scholes PDE &amp; Delta Hedging</li>
                    <li>• Markov Decision Processes &amp; RL</li>
                </ul>
            </div>
            <div class="p-3 rounded-lg bg-black/50 border-2 border-amber-400">
                <div class="font-extrabold text-amber-300 uppercase mb-1.5">Education &amp; Honours</div>
                <ul class="space-y-1 text-slate-200">
                    <li>• MMath, Univ. of Manchester</li>
                    <li>• UKMT Senior Challenge: Gold</li>
                    <li>• Senior Kangaroo: 1st in School</li>
                    <li>• Best Math Research Award</li>
                </ul>
            </div>
            <div class="p-3 rounded-lg bg-black/50 border-2 border-emerald-400">
                <div class="font-extrabold text-emerald-300 uppercase mb-1.5">Technical Stack</div>
                <ul class="space-y-1 text-slate-200">
                    <li>• Python (NumPy, SciPy, Pandas)</li>
                    <li>• Finite-Volume &amp; Monte Carlo</li>
                    <li>• FastAPI, pytest, Git &amp; Unix</li>
                </ul>
            </div>
        </div>
    `
};

const CT_PROJECT_DATA = [
    {
        projectIndex: 0,
        shortLabel: 'PROJECT 01: LWR TRAFFIC & RL',
        passengerName: 'PROF. RIEMANN (PROJECT 01)',
        destName: 'URBAN SIGNAL GRID (PROJECT 01 DROP-OFF)',
        shirtColor: '#38bdf8',
        ringColor: '#facc15',
        baseFare: 850,
        tripDist: 70,
        badge: 'VIP PROJECT 01 PICKED UP! · DELIVER FOR +$850 FARE',
        title: 'TRAFFIC FLOW MODELLING & REINFORCEMENT LEARNING',
        link: 'traffic-lwr.html',
        html: `
            <div class="space-y-2.5 text-xs sm:text-sm">
                <p class="text-yellow-300 font-semibold">
                    ★ Destination: Signalised Urban Grid (1 to 36 Junctions) · Best Independent Math Research Award
                </p>
                <ul class="space-y-1.5 text-slate-200">
                    <li>• <strong>Hyperbolic PDE Solver:</strong> Solved the nonlinear LWR conservation law (∂ₜρ + ∂ₓq(ρ) = 0) with a conservative Godunov demand–supply finite-volume scheme, proving equivalence to the exact Riemann flux.</li>
                    <li>• <strong>96-State Shared Q-Learning:</strong> Engineered a shared-table signal controller trained on network-wide flux rewards with sensor-informed priors to accelerate cold-start convergence.</li>
                    <li>• <strong>6-Seed Benchmark:</strong> Raised junction flux by up to <strong>+2.9%</strong> and cut total time spent (TTS) by <strong>7–19%</strong> at medium load on grids of 2×2 and up.</li>
                </ul>
            </div>
        `
    },
    {
        projectIndex: 1,
        shortLabel: 'PROJECT 02: BLACK–SCHOLES PDE',
        passengerName: 'DR. ITÔ (PROJECT 02)',
        destName: 'DERIVATIVES EXCHANGE (PROJECT 02 DROP-OFF)',
        shirtColor: '#f472b6',
        ringColor: '#facc15',
        baseFare: 1000,
        tripDist: 78,
        badge: 'VIP PROJECT 02 PICKED UP! · DELIVER FOR +$1,000 FARE',
        title: 'OPTION PRICING & DELTA HEDGING UNDER BLACK–SCHOLES',
        link: 'option-pricing.html',
        html: `
            <div class="space-y-2.5 text-xs sm:text-sm">
                <p class="text-emerald-300 font-semibold">
                    ★ Destination: Quantitative Derivatives Exchange · Python, NumPy, SciPy
                </p>
                <ul class="space-y-1.5 text-slate-200">
                    <li>• <strong>Black–Scholes PDE &amp; Greeks:</strong> Derived the Black–Scholes PDE from a delta-hedging argument using Itô's Lemma, solved it in closed form for European options, and derived the Greeks.</li>
                    <li>• <strong>10⁶-Path Monte Carlo Validation:</strong> Validated the closed-form call price against risk-neutral Monte Carlo (<strong>10.45</strong> analytic vs. <strong>10.47 ± 0.01</strong> simulated).</li>
                    <li>• <strong>20,000-Path Discrete Delta Hedging:</strong> Showed the hedging-error standard deviation decays as <strong>N⁻¹/²</strong> in the number of rebalances (fitted log–log slope <strong>−0.49</strong>).</li>
                </ul>
            </div>
        `
    }
];

const CT_REGULAR_TYPES = [
    { shortLabel: 'FARE: QUANT TRADER (+$450)', passengerName: 'QUANT TRADER', destName: 'CANARY WHARF DESK', shirtColor: '#4ade80', baseFare: 450, tripDist: 52 },
    { shortLabel: 'FARE: PDE RESEARCHER (+$400)', passengerName: 'PDE RESEARCHER', destName: 'ALAN TURING BUILDING', shirtColor: '#a855f7', baseFare: 400, tripDist: 48 },
    { shortLabel: 'FARE: MANCHESTER STUDENT (+$350)', passengerName: 'MANCHESTER STUDENT', destName: 'OXFORD ROAD STATION', shirtColor: '#fb923c', baseFare: 350, tripDist: 44 },
    { shortLabel: 'FARE: ARCADE GAMER (+$500)', passengerName: 'ARCADE GAMER', destName: 'SEGA AMUSEMENT PLAZA', shirtColor: '#2dd4bf', baseFare: 500, tripDist: 56 }
];

const CT_BILLBOARDS = [
    { title: 'DRIVER: DENIZ COBAN', sub: 'MMATH @ MANCHESTER', bg: '#1e3a8a', border: '#facc15' },
    { title: 'UKMT GOLD AWARD', sub: 'SENIOR KANGAROO 1ST', bg: '#7c2d12', border: '#fde047' },
    { title: '3-LANE HIGHWAY', sub: 'PICK UP ON SHOULDERS!', bg: '#14532d', border: '#4ade80' },
    { title: 'HOLD SPACE + STEER', sub: 'CRAZY DRIFT COMBO $$$', bg: '#311042', border: '#f472b6' },
    { title: 'PYTHON · NUMPY', sub: 'SCIPY · FASTAPI · PYTEST', bg: '#0f172a', border: '#38bdf8' }
];

const CT_LANES = [-0.58, 0.0, 0.58]; // Left, Middle, Right highway lanes
const CT_TRACK_LENGTH = 300;

let ctBestScore = 0;
try {
    ctBestScore = parseInt(localStorage.getItem('ct_best_fare') || '0', 10) || 0;
} catch (e) {
    ctBestScore = 0;
}

const ctState = {
    active: false,
    gamePhase: 'MENU', // 'MENU' | 'PLAYING' | 'MODAL'
    animId: null,
    z: 0,
    playerX: 0.0,      // -1.12 (left roadside) .. -0.58 (L) .. 0.0 (M) .. +0.58 (R) .. +1.12 (right roadside)
    steerVel: 0,
    driftAngle: 0,     // Slip angle yaw during drift
    driftCharge: 0,    // Accumulated drift duration
    driftCashAccum: 0,
    speed: 0.18,
    fare: 0,
    bestFare: ctBestScore,
    dropOffs: 0,
    timer: 60.0,
    nextProjectIdx: 0, // Enforces Project 01 first, then after drop-off Project 02
    seatedPassenger: null, // null when empty! Holds passenger object until dropped off
    dropOffZone: null,     // { zPos, side, destName } active while carrying a passenger
    passengers: [],        // Roadside waiting passengers (mix of VIP Project + Regular Fares)
    obstacles: [],         // Traffic cars, trucks & road barriers in the 3 lanes
    skidmarks: [],         // Persistent tire marks on road segments when drifting
    particles: [],         // Drift smoke & yellow/orange sparks
    shakeFrames: 0,
    keys: { left: false, right: false, up: false, down: false, space: false }
};

function updateHudDisplays() {
    const fareEl = document.getElementById('ct-fare-display');
    if (fareEl) fareEl.innerText = '$' + Math.round(ctState.fare).toLocaleString('en-US');

    if (ctState.fare > ctState.bestFare) {
        ctState.bestFare = Math.round(ctState.fare);
        try {
            localStorage.setItem('ct_best_fare', String(ctState.bestFare));
        } catch (e) {}
    }
    const bestEl = document.getElementById('ct-best-display');
    if (bestEl) bestEl.innerText = '$' + Math.round(ctState.bestFare).toLocaleString('en-US');

    const timerEl = document.getElementById('ct-timer-display');
    if (timerEl) {
        timerEl.innerText = Math.max(0, ctState.timer).toFixed(2);
        timerEl.style.color = ctState.timer <= 10 ? '#ef4444' : '#fde047';
    }
}

function spawnInitialWorld() {
    ctState.passengers = [];
    ctState.obstacles = [];
    ctState.skidmarks = [];
    ctState.particles = [];

    // Spawn waiting passengers on Left (-1.02) and Right (+1.02) roadside shoulders
    // First VIP Project passenger (Project 01) waiting ahead on the right shoulder, plus regular passengers
    const p1 = CT_PROJECT_DATA[0];
    ctState.passengers.push({
        uid: 'proj-0',
        isProject: true,
        projectIndex: 0,
        zPos: 48,
        side: 1.02, // Right shoulder
        shortLabel: p1.shortLabel,
        passengerName: p1.passengerName,
        destName: p1.destName,
        shirtColor: p1.shirtColor,
        ringColor: p1.ringColor,
        baseFare: p1.baseFare,
        tripDist: p1.tripDist,
        badge: p1.badge,
        title: p1.title,
        link: p1.link,
        html: p1.html
    });

    // Spawn 5 regular city passengers around the track on alternating roadside shoulders
    const regPositions = [
        { z: 26, side: -1.02, typeIdx: 0 },
        { z: 85, side: -1.02, typeIdx: 1 },
        { z: 135, side: 1.02, typeIdx: 2 },
        { z: 190, side: -1.02, typeIdx: 3 },
        { z: 245, side: 1.02, typeIdx: 0 }
    ];
    regPositions.forEach((slot, idx) => {
        const reg = CT_REGULAR_TYPES[slot.typeIdx % CT_REGULAR_TYPES.length];
        ctState.passengers.push({
            uid: 'reg-' + idx,
            isProject: false,
            zPos: slot.z,
            side: slot.side,
            shortLabel: reg.shortLabel,
            passengerName: reg.passengerName,
            destName: reg.destName,
            shirtColor: reg.shirtColor,
            ringColor: '#4ade80',
            baseFare: reg.baseFare,
            tripDist: reg.tripDist
        });
    });

    // Spawn obstacles across all 3 lanes (-0.58, 0.0, +0.58)
    const obstacleTemplates = [
        { z: 36, laneIdx: 0, kind: 'car', color: '#ef4444', speed: 0.09, label: 'SEDAN' },
        { z: 68, laneIdx: 1, kind: 'truck', color: '#3b82f6', speed: 0.07, label: 'TRUCK' },
        { z: 102, laneIdx: 2, kind: 'barrier', color: '#f97316', speed: 0.0, label: 'ROADWORK' },
        { z: 138, laneIdx: 0, kind: 'car', color: '#a855f7', speed: 0.10, label: 'COUPE' },
        { z: 172, laneIdx: 1, kind: 'barrier', color: '#ef4444', speed: 0.0, label: 'BARRIER' },
        { z: 208, laneIdx: 2, kind: 'truck', color: '#10b981', speed: 0.08, label: 'VAN' },
        { z: 248, laneIdx: 1, kind: 'car', color: '#f59e0b', speed: 0.10, label: 'CAB' },
        { z: 282, laneIdx: 0, kind: 'barrier', color: '#f97316', speed: 0.0, label: 'BARRIER' }
    ];
    obstacleTemplates.forEach((ob, idx) => {
        ctState.obstacles.push({
            id: idx,
            z: ob.z,
            lane: CT_LANES[ob.laneIdx],
            kind: ob.kind,
            color: ob.color,
            speed: ob.speed,
            nearMissAwarded: false
        });
    });
}

function ensureActiveProjectPassengerSpawned() {
    const targetProjIdx = ctState.nextProjectIdx;
    const alreadyExists = ctState.passengers.some(p => p.isProject && p.projectIndex === targetProjIdx);
    if (!alreadyExists && !ctState.seatedPassenger) {
        const pData = CT_PROJECT_DATA[targetProjIdx];
        const spawnZ = (Math.floor(ctState.z) + 52) % CT_TRACK_LENGTH;
        const side = targetProjIdx % 2 === 0 ? 1.02 : -1.02;
        ctState.passengers.push({
            uid: 'proj-' + targetProjIdx + '-' + Date.now(),
            isProject: true,
            projectIndex: targetProjIdx,
            zPos: spawnZ,
            side: side,
            shortLabel: pData.shortLabel,
            passengerName: pData.passengerName,
            destName: pData.destName,
            shirtColor: pData.shirtColor,
            ringColor: pData.ringColor,
            baseFare: pData.baseFare,
            tripDist: pData.tripDist,
            badge: pData.badge,
            title: pData.title,
            link: pData.link,
            html: pData.html
        });
    }
}

function toggleCrazyTaxi(open) {
    const view = document.getElementById('crazy-taxi-view');
    if (!view) return;
    const shouldOpen = typeof open === 'boolean' ? open : view.classList.contains('hidden');

    if (shouldOpen) {
        view.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        ctState.active = true;
        resizeCrazyTaxiCanvas();
        spawnInitialWorld();
        updateHudDisplays();
        openCrazyTaxiMainMenu('WELCOME');
        if (!ctState.animId) {
            ctLoop();
        }
    } else {
        view.classList.add('hidden');
        document.body.style.overflow = '';
        ctState.active = false;
        closeCrazyTaxiModal();
        if (ctState.animId) {
            cancelAnimationFrame(ctState.animId);
            ctState.animId = null;
        }
    }
}

function openCrazyTaxiMainMenu(reason) {
    ctState.gamePhase = 'MENU';
    ctState.keys = { left: false, right: false, up: false, down: false, space: false };
    const menu = document.getElementById('ct-main-menu');
    const summary = document.getElementById('ct-run-summary');
    const reasonEl = document.getElementById('ct-run-reason');
    const fareEl = document.getElementById('ct-summary-fare');
    const countEl = document.getElementById('ct-summary-Count');
    const bestEl = document.getElementById('ct-summary-best');
    const btnLabel = document.getElementById('ct-start-btn-label');

    if (menu) menu.classList.remove('hidden');

    if (reason === 'CRASH' || reason === 'TIME_UP' || reason === 'PAUSED') {
        if (summary) summary.classList.remove('hidden');
        if (reasonEl) {
            if (reason === 'CRASH') {
                reasonEl.innerText = '💥 CRASHED INTO AN OBSTACLE! RUN ENDED';
                reasonEl.className = 'text-xs sm:text-sm font-black uppercase tracking-widest text-red-400 mb-1';
            } else if (reason === 'TIME_UP') {
                reasonEl.innerText = "⏰ TIME'S UP! 60-SECOND SHIFT COMPLETE!";
                reasonEl.className = 'text-xs sm:text-sm font-black uppercase tracking-widest text-yellow-300 mb-1';
            } else {
                reasonEl.innerText = '⏸ GAME PAUSED · CURRENT RUN STATS';
                reasonEl.className = 'text-xs sm:text-sm font-black uppercase tracking-widest text-sky-300 mb-1';
            }
        }
        if (fareEl) fareEl.innerText = '$' + Math.round(ctState.fare).toLocaleString('en-US');
        if (countEl) countEl.innerText = String(ctState.dropOffs);
        if (bestEl) bestEl.innerText = '$' + Math.round(ctState.bestFare).toLocaleString('en-US');
        if (btnLabel) {
            btnLabel.innerText = reason === 'PAUSED' ? 'RESTART FRESH 60s RUN' : 'PLAY AGAIN · NEW 60s RUN';
        }
    } else {
        if (summary) summary.classList.add('hidden');
        if (btnLabel) btnLabel.innerText = 'START 60s CRAZY RUN';
    }
}

function startCrazyTaxiRun() {
    const menu = document.getElementById('ct-main-menu');
    if (menu) menu.classList.add('hidden');
    closeCrazyTaxiModal();

    ctState.z = 0;
    ctState.playerX = 0.0; // Start in middle lane
    ctState.steerVel = 0;
    ctState.driftAngle = 0;
    ctState.driftCharge = 0;
    ctState.driftCashAccum = 0;
    ctState.speed = 0.20;
    ctState.fare = 0;
    ctState.dropOffs = 0;
    ctState.timer = 60.0;
    ctState.nextProjectIdx = 0;
    ctState.seatedPassenger = null; // Empty right seat!
    ctState.dropOffZone = null;
    ctState.shakeFrames = 0;
    ctState.gamePhase = 'PLAYING';

    spawnInitialWorld();
    updateHudDisplays();
    setBannerText('★ PICK UP A PASSENGER ON THE ROADSIDE! ★', '#fde047');
}

function resizeCrazyTaxiCanvas() {
    const canvas = document.getElementById('ct-canvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    if (ctState.active) resizeCrazyTaxiCanvas();
});

window.addEventListener('keydown', (e) => {
    if (!ctState.active) return;
    if (e.key === 'Escape') {
        if (ctState.gamePhase === 'MODAL') {
            closeCrazyTaxiModal();
        } else if (ctState.gamePhase === 'PLAYING') {
            openCrazyTaxiMainMenu('PAUSED');
        } else {
            toggleCrazyTaxi(false);
        }
        return;
    }

    if (ctState.gamePhase !== 'PLAYING') return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        ctState.keys.left = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        ctState.keys.right = true;
    }
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        ctState.keys.up = true;
    }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        ctState.keys.down = true;
    }
    if (e.key === ' ') {
        e.preventDefault();
        ctState.keys.space = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (!ctState.active) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') ctState.keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') ctState.keys.right = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') ctState.keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') ctState.keys.down = false;
    if (e.key === ' ') {
        // Release drift boost if charged!
        if (ctState.driftCharge > 12 && ctState.gamePhase === 'PLAYING') {
            ctState.speed = Math.min(0.46, ctState.speed + 0.09);
            triggerCrazyCombo('DRIFT BOOST! +$100', 100, '#38bdf8');
        }
        ctState.keys.space = false;
        ctState.driftCharge = 0;
        ctState.driftCashAccum = 0;
    }
});

function setBannerText(text, color) {
    const banner = document.getElementById('ct-combo-banner');
    if (!banner) return;
    banner.innerText = text;
    if (color) banner.style.color = color;
}

function triggerCrazyCombo(label, bonus, color = '#4ade80') {
    ctState.fare += bonus;
    updateHudDisplays();

    const banner = document.getElementById('ct-combo-banner');
    if (banner) {
        banner.innerText = '★ ' + label + ' ★';
        banner.style.color = color;
        banner.style.transform = 'skewX(-12deg) rotate(-2deg) scale(1.08)';
        setTimeout(() => {
            if (banner) banner.style.transform = 'skewX(-12deg) rotate(-2deg) scale(1)';
        }, 160);
    }
}

function openDriverLicenseModal() {
    ctState.gamePhase = 'MODAL';
    ctState.keys = { left: false, right: false, up: false, down: false, space: false };
    document.getElementById('ct-modal-badge').innerText = CT_DRIVER_LICENSE.badge;
    document.getElementById('ct-modal-title').innerText = CT_DRIVER_LICENSE.title;
    document.getElementById('ct-modal-body').innerHTML = CT_DRIVER_LICENSE.html;
    document.getElementById('ct-modal-link').classList.add('hidden');
    const hintEl = document.getElementById('ct-modal-hint');
    if (hintEl) hintEl.innerText = 'Official Class-S Driver Profile for Deniz Coban.';
    const btnEl = document.getElementById('ct-modal-continue-btn');
    if (btnEl) btnEl.innerText = 'BACK TO DRIVING ➔';
    document.getElementById('ct-stop-modal').classList.remove('hidden');
}

function pickUpPassenger(passenger) {
    // Seat the passenger in the convertible's right seat!
    ctState.seatedPassenger = passenger;

    // Remove this passenger from roadside waiting list
    ctState.passengers = ctState.passengers.filter(p => p.uid !== passenger.uid);

    // Create a Drop-Off Zone down the road on a roadside shoulder
    const destZ = (Math.floor(ctState.z) + passenger.tripDist) % CT_TRACK_LENGTH;
    const destSide = passenger.side > 0 ? -1.02 : 1.02; // Opposite shoulder for fun lane crossing!
    ctState.dropOffZone = {
        zPos: destZ,
        side: destSide,
        destName: passenger.destName,
        pickupTime: ctState.timer
    };

    if (passenger.isProject) {
        // VIP Project Passenger: Award pickup bonus and open Project Briefing Modal
        // Passenger stays in the car after closing the modal until dropped off!
        triggerCrazyCombo('VIP PROJECT PICKUP! +$250', 250, '#fde047');
        ctState.gamePhase = 'MODAL';
        ctState.keys = { left: false, right: false, up: false, down: false, space: false };

        document.getElementById('ct-modal-badge').innerText = passenger.badge;
        document.getElementById('ct-modal-title').innerText = passenger.title;
        document.getElementById('ct-modal-body').innerHTML = passenger.html;

        const linkBtn = document.getElementById('ct-modal-link');
        if (passenger.link) {
            linkBtn.href = passenger.link;
            linkBtn.classList.remove('hidden');
        } else {
            linkBtn.classList.add('hidden');
        }
        const hintEl = document.getElementById('ct-modal-hint');
        if (hintEl) {
            hintEl.innerText = `Passenger seated! Now drive ${passenger.passengerName} to ${passenger.destName} (${destSide < 0 ? 'LEFT' : 'RIGHT'} SHOULDER) to complete the drop-off and unlock the next project!`;
        }
        const btnEl = document.getElementById('ct-modal-continue-btn');
        if (btnEl) btnEl.innerText = 'DRIVE PASSENGER TO DROP-OFF ZONE ➔';

        document.getElementById('ct-stop-modal').classList.remove('hidden');
    } else {
        // Regular City Passenger: Fast arcade pickup without interrupting gameplay!
        triggerCrazyCombo(`PICKED UP ${passenger.passengerName}! +$150`, 150, '#4ade80');
    }
}

function completePassengerDropOff() {
    if (!ctState.seatedPassenger || !ctState.dropOffZone) return;
    const passenger = ctState.seatedPassenger;

    // Calculate speed tip based on how fast the delivery was made
    const elapsed = Math.max(1, (ctState.dropOffZone.pickupTime || ctState.timer) - ctState.timer);
    const speedTip = elapsed < 8 ? 250 : (elapsed < 14 ? 150 : 75);
    const totalEarned = passenger.baseFare + speedTip;

    ctState.dropOffs += 1;
    triggerCrazyCombo(`DROPPED OFF! +$${totalEarned} (INCL. $${speedTip} SPEED TIP!)`, totalEarned, '#fde047');

    // Empty the passenger seat!
    ctState.seatedPassenger = null;
    ctState.dropOffZone = null;

    if (passenger.isProject) {
        // Advance to the second project (or cycle) now that this project passenger was dropped off!
        ctState.nextProjectIdx = (passenger.projectIndex + 1) % CT_PROJECT_DATA.length;
        ensureActiveProjectPassengerSpawned();
    } else {
        // Respawn a new regular passenger further down the road
        const reg = CT_REGULAR_TYPES[Math.floor(Math.random() * CT_REGULAR_TYPES.length)];
        const newZ = (Math.floor(ctState.z) + 95 + Math.floor(Math.random() * 110)) % CT_TRACK_LENGTH;
        const newSide = Math.random() < 0.5 ? -1.02 : 1.02;
        ctState.passengers.push({
            uid: 'reg-' + Date.now() + '-' + Math.random(),
            isProject: false,
            zPos: newZ,
            side: newSide,
            shortLabel: reg.shortLabel,
            passengerName: reg.passengerName,
            destName: reg.destName,
            shirtColor: reg.shirtColor,
            ringColor: '#4ade80',
            baseFare: reg.baseFare,
            tripDist: reg.tripDist
        });
        ensureActiveProjectPassengerSpawned();
    }
}

function closeCrazyTaxiModal() {
    const modal = document.getElementById('ct-stop-modal');
    if (modal) modal.classList.add('hidden');
    const menu = document.getElementById('ct-main-menu');
    const menuVisible = menu && !menu.classList.contains('hidden');
    ctState.gamePhase = menuVisible ? 'MENU' : 'PLAYING';
}

function getRoadCurve(z) {
    return Math.sin(z * 0.028) * 115 + Math.cos(z * 0.014) * 55;
}

function getRoadHill(z) {
    return Math.sin(z * 0.04) * 24;
}

function getCircularDist(targetZ, currentZ) {
    let d = targetZ - currentZ;
    while (d < 0) d += CT_TRACK_LENGTH;
    while (d >= CT_TRACK_LENGTH) d -= CT_TRACK_LENGTH;
    return d;
}

function ctLoop() {
    if (!ctState.active) return;

    const canvas = document.getElementById('ct-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // ------------------------------------------------------------------
    // UPDATE PHYSICS, DRIFT, OBSTACLES & PASSENGER PICKUP/DROP-OFF
    // ------------------------------------------------------------------
    if (ctState.gamePhase === 'PLAYING') {
        // 1-Minute Countdown Timer
        ctState.timer -= 1 / 60;
        if (ctState.timer <= 0) {
            ctState.timer = 0;
            updateHudDisplays();
            openCrazyTaxiMainMenu('TIME_UP');
        } else {
            updateHudDisplays();
        }

        // Acceleration / Braking
        const isDrifting = ctState.keys.space && ctState.speed > 0.14;
        const targetSpeed = ctState.keys.up ? 0.39 : (ctState.keys.down ? 0.09 : 0.22);
        ctState.speed += (targetSpeed - ctState.speed) * 0.07;
        ctState.z = (ctState.z + ctState.speed) % CT_TRACK_LENGTH;

        // Gear & Speedometer HUD
        const mph = Math.round(ctState.speed * 285);
        const speedEl = document.getElementById('ct-speed-display');
        if (speedEl) speedEl.innerText = String(mph);
        const gearEl = document.getElementById('ct-gear-display');
        if (gearEl) {
            gearEl.innerText = isDrifting ? 'S' : (ctState.keys.down ? 'B' : 'D');
            gearEl.style.color = isDrifting ? '#38bdf8' : '#fde047';
        }

        // 3-Lane + Roadside Shoulder Steering & Upgraded Crazy Drift Mechanic
        const steerInput = (ctState.keys.right ? 1 : 0) - (ctState.keys.left ? 1 : 0);
        if (isDrifting) {
            // Drift physics: high slip angle yaw, wider lateral slide, skidmarks & sparks
            const driftTargetVel = steerInput !== 0 ? steerInput * 0.034 : (ctState.driftAngle >= 0 ? 0.022 : -0.022);
            ctState.steerVel += (driftTargetVel - ctState.steerVel) * 0.18;
            const targetYaw = steerInput !== 0 ? steerInput * 0.38 : (ctState.steerVel >= 0 ? 0.28 : -0.28);
            ctState.driftAngle += (targetYaw - ctState.driftAngle) * 0.22;
            ctState.driftCharge += 1;

            // Leave twin black tire skidmarks on the road
            ctState.skidmarks.push({
                z: (ctState.z + 1.8) % CT_TRACK_LENGTH,
                laneX: ctState.playerX,
                yaw: ctState.driftAngle,
                life: 85
            });
            if (ctState.skidmarks.length > 90) ctState.skidmarks.shift();

            // Spawn tire smoke & orange/yellow sparks
            for (let i = 0; i < 2; i++) {
                ctState.particles.push({
                    vx: (Math.random() - 0.5) * 6 - ctState.steerVel * 90,
                    vy: -Math.random() * 3 - 1,
                    xOffset: (i === 0 ? -54 : 54) + (Math.random() - 0.5) * 10,
                    yOffset: 22 + Math.random() * 6,
                    size: ctState.driftCharge > 18 ? 6 + Math.random() * 5 : 10 + Math.random() * 8,
                    color: ctState.driftCharge > 18
                        ? (Math.random() < 0.5 ? '#fde047' : '#f97316')
                        : 'rgba(241, 245, 249, 0.75)',
                    life: 16
                });
            }

            // Award continuous drift cash every 12 frames
            if (ctState.driftCharge % 12 === 0) {
                ctState.driftCashAccum += 25;
                ctState.fare += 25;
                updateHudDisplays();
                setBannerText(`★ CRAZY DRIFT COMBO! +$${ctState.driftCashAccum} ★`, '#38bdf8');
            }
        } else {
            // Crisp normal steering across Left (-0.58), Center (0.0), Right (+0.58), and Shoulders (±1.02)
            if (steerInput !== 0) {
                ctState.steerVel += (steerInput * 0.025 - ctState.steerVel) * 0.28;
            } else {
                ctState.steerVel *= 0.78;
            }
            ctState.driftAngle *= 0.78;
        }

        ctState.playerX = Math.max(-1.12, Math.min(1.12, ctState.playerX + ctState.steerVel));

        // Update skidmarks & particles
        ctState.skidmarks.forEach(s => { s.life -= 1; });
        ctState.skidmarks = ctState.skidmarks.filter(s => s.life > 0);
        ctState.particles.forEach(pt => {
            pt.xOffset += pt.vx;
            pt.yOffset += pt.vy;
            pt.life -= 1;
        });
        ctState.particles = ctState.particles.filter(pt => pt.life > 0);

        // Passenger Pick-Up OR Drop-Off State Machine
        const radarEl = document.getElementById('ct-next-stop-name');
        if (ctState.seatedPassenger && ctState.dropOffZone) {
            // Carrying a passenger -> Drive to Drop-Off Zone!
            const distToDrop = getCircularDist(ctState.dropOffZone.zPos, ctState.z);
            const sideLabel = ctState.dropOffZone.side < 0 ? 'LEFT SHOULDER' : 'RIGHT SHOULDER';
            if (radarEl) {
                radarEl.innerText = `DROP OFF: ${ctState.dropOffZone.destName} (${sideLabel} · ${Math.round(distToDrop * 3)}m)`;
            }

            // Check if player drove into the glowing Drop-Off Zone on the roadside shoulder
            const lateralDiff = Math.abs(ctState.playerX - ctState.dropOffZone.side);
            if (distToDrop < 2.8 && lateralDiff < 0.36) {
                completePassengerDropOff();
            }
        } else {
            // Empty cab -> Look for nearest waiting passenger (prioritize VIP Project passenger on radar)
            ensureActiveProjectPassengerSpawned();
            const vipPassenger = ctState.passengers.find(p => p.isProject);
            if (vipPassenger && radarEl) {
                const distVip = getCircularDist(vipPassenger.zPos, ctState.z);
                const sideLabel = vipPassenger.side < 0 ? 'LEFT CURB' : 'RIGHT CURB';
                radarEl.innerText = `VIP ${vipPassenger.shortLabel} (${sideLabel} · ${Math.round(distVip * 3)}m)`;
            }

            // Check pickup collision with ANY waiting roadside passenger
            for (let i = 0; i < ctState.passengers.length; i++) {
                const p = ctState.passengers[i];
                const distP = getCircularDist(p.zPos, ctState.z);
                const latDiff = Math.abs(ctState.playerX - p.side);
                if (distP < 2.5 && latDiff < 0.34) {
                    pickUpPassenger(p);
                    break;
                }
            }
        }

        // Advance Obstacles in the 3 lanes & check Crash / Near-Miss
        const carRelZ = 2.0; // Player cab sits at relZ = 2.0 in front of camera
        for (let i = 0; i < ctState.obstacles.length; i++) {
            const ob = ctState.obstacles[i];
            ob.z = (ob.z + ob.speed) % CT_TRACK_LENGTH;

            let relZ = ob.z - ctState.z;
            if (relZ < -CT_TRACK_LENGTH / 2) relZ += CT_TRACK_LENGTH;
            if (relZ > CT_TRACK_LENGTH / 2) relZ -= CT_TRACK_LENGTH;

            const zDiff = Math.abs(relZ - carRelZ);
            const xDiff = Math.abs(ob.lane - ctState.playerX);

            if (zDiff < 1.15 && xDiff < 0.24) {
                // Direct Collision with Obstacle -> Reset/End Run!
                ctState.shakeFrames = 18;
                openCrazyTaxiMainMenu('CRASH');
                break;
            } else if (zDiff < 1.25 && xDiff < 0.42 && !ob.nearMissAwarded) {
                ob.nearMissAwarded = true;
                triggerCrazyCombo('CRAZY THROUGH! +$100', 100, '#fde047');
            } else if (zDiff > 8) {
                ob.nearMissAwarded = false;
            }
        }
    } else if (ctState.gamePhase === 'MENU') {
        // Gentle background attract-mode cruise while Main Menu is open
        ctState.z = (ctState.z + 0.14) % CT_TRACK_LENGTH;
    }

    // ------------------------------------------------------------------
    // 1. RENDER SUNNY GAMECUBE SKY, SUN & DISTANT CITY SKYLINE
    // ------------------------------------------------------------------
    ctx.save();
    if (ctState.shakeFrames > 0) {
        ctState.shakeFrames -= 1;
        ctx.translate((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 18);
    }

    const horizonY = Math.round(h * 0.41 + getRoadHill(ctState.z) * 0.35);
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, '#0284c7');
    skyGrad.addColorStop(0.6, '#38bdf8');
    skyGrad.addColorStop(1, '#fef08a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY + 2);

    // Bright Arcade Sun
    const sunX = w * 0.75 - getRoadCurve(ctState.z) * 0.3;
    const sunY = horizonY - 68;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
    ctx.beginPath(); ctx.arc(sunX, sunY, 62, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(sunX, sunY, 38, 0, Math.PI * 2); ctx.fill();

    // Distant City Skyline Silhouette
    ctx.fillStyle = '#1e293b';
    const cityOffset = -getRoadCurve(ctState.z) * 0.4;
    for (let i = -4; i < 24; i++) {
        const bw = 50 + ((i * 19) % 30);
        const bh = 26 + Math.abs(Math.sin(i * 1.7)) * 70;
        const bx = ((i * 68 + cityOffset) % (w + 240));
        ctx.fillRect(bx, horizonY - bh, bw, bh + 2);
    }

    // Fill ground from horizon to bottom of screen
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(0, horizonY, w, h - horizonY);

    // ------------------------------------------------------------------
    // 2. 3D PERSPECTIVE 3-LANE HIGHWAY + ROADSIDE PICKUP SHOULDERS
    // ------------------------------------------------------------------
    const DRAW_DIST = 75;
    const baseCurve = getRoadCurve(ctState.z);
    const baseHill = getRoadHill(ctState.z);
    const baseSeg = Math.floor(ctState.z);
    const fracZ = ctState.z - baseSeg;

    // Camera follows 28% of playerX so the convertible visibly moves across all 3 lanes & shoulders!
    const camX = ctState.playerX * 0.28;

    const project = (laneOffset, relZ, worldZ) => {
        const clampedZ = Math.max(0, relZ);
        const scale = 1 / (1 + clampedZ * 0.085);
        const curveOffset = (getRoadCurve(worldZ) - baseCurve) * (1 - scale) * 1.15;
        const hillOffset = (getRoadHill(worldZ) - baseHill) * (1 - scale) * 0.85;
        const roadHalfW = (w * 0.42) * scale;
        const roadCenterX = w * 0.5 - camX * roadHalfW + curveOffset;
        const sx = roadCenterX + laneOffset * roadHalfW;
        const sy = horizonY + (h - horizonY) * scale - hillOffset;
        return { sx, sy, roadCenterX, roadHalfW, scale };
    };

    for (let d = DRAW_DIST; d >= 1; d--) {
        const segIndex = baseSeg + d - 1;
        const relZ1 = d - fracZ;
        const relZ0 = Math.max(0, d - 1 - fracZ);

        const p1 = project(0, relZ1, segIndex + 1);
        const p0 = project(0, relZ0, segIndex);

        const isAlt = Math.abs(segIndex) % 2 === 0;

        // Outer Sand / Grass
        ctx.fillStyle = isAlt ? '#eab308' : '#ca8a04';
        ctx.fillRect(0, p1.sy, w, Math.max(2, p0.sy - p1.sy + 1));

        // Paved Roadside Pickup Shoulders (±0.88 to ±1.18 roadHalfW)
        const shOuter1 = p1.roadHalfW * 1.20;
        const shOuter0 = p0.roadHalfW * 1.20;
        ctx.fillStyle = isAlt ? '#475569' : '#334155';
        ctx.beginPath();
        ctx.moveTo(p1.roadCenterX - shOuter1, p1.sy);
        ctx.lineTo(p1.roadCenterX + shOuter1, p1.sy);
        ctx.lineTo(p0.roadCenterX + shOuter0, p0.sy);
        ctx.lineTo(p0.roadCenterX - shOuter0, p0.sy);
        ctx.closePath();
        ctx.fill();

        // Main 3-Lane Road Asphalt (-0.88 to +0.88 roadHalfW)
        const mainW1 = p1.roadHalfW * 0.88;
        const mainW0 = p0.roadHalfW * 0.88;
        ctx.fillStyle = isAlt ? '#334155' : '#1e293b';
        ctx.beginPath();
        ctx.moveTo(p1.roadCenterX - mainW1, p1.sy);
        ctx.lineTo(p1.roadCenterX + mainW1, p1.sy);
        ctx.lineTo(p0.roadCenterX + mainW0, p0.sy);
        ctx.lineTo(p0.roadCenterX - mainW0, p0.sy);
        ctx.closePath();
        ctx.fill();

        // Yellow & Red Arcade Outer Curbs
        const curbW1 = p1.roadHalfW * 0.07;
        const curbW0 = p0.roadHalfW * 0.07;
        ctx.fillStyle = isAlt ? '#facc15' : '#ef4444';
        // Left outer curb
        ctx.beginPath();
        ctx.moveTo(p1.roadCenterX - shOuter1 - curbW1, p1.sy);
        ctx.lineTo(p1.roadCenterX - shOuter1, p1.sy);
        ctx.lineTo(p0.roadCenterX - shOuter0, p0.sy);
        ctx.lineTo(p0.roadCenterX - shOuter0 - curbW0, p0.sy);
        ctx.closePath();
        ctx.fill();
        // Right outer curb
        ctx.beginPath();
        ctx.moveTo(p1.roadCenterX + shOuter1, p1.sy);
        ctx.lineTo(p1.roadCenterX + shOuter1 + curbW1, p1.sy);
        ctx.lineTo(p0.roadCenterX + shOuter0 + curbW0, p0.sy);
        ctx.lineTo(p0.roadCenterX + shOuter0, p0.sy);
        ctx.closePath();
        ctx.fill();

        // Solid Yellow Shoulder Line separating the 3 Lanes from the Pickup Shoulders (±0.88)
        [-0.88, 0.88].forEach(edge => {
            const ex1 = p1.roadCenterX + edge * p1.roadHalfW;
            const ex0 = p0.roadCenterX + edge * p0.roadHalfW;
            const ew1 = Math.max(1.5, p1.roadHalfW * 0.018);
            const ew0 = Math.max(2, p0.roadHalfW * 0.018);
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.moveTo(ex1 - ew1, p1.sy);
            ctx.lineTo(ex1 + ew1, p1.sy);
            ctx.lineTo(ex0 + ew0, p0.sy);
            ctx.lineTo(ex0 - ew0, p0.sy);
            ctx.closePath();
            ctx.fill();
        });

        // White Lane Divider Dashed Lines between Left (-0.58), Center (0.0), and Right (+0.58) Lanes
        if (Math.abs(segIndex) % 3 !== 0) {
            ctx.fillStyle = '#f8fafc';
            [-0.29, 0.29].forEach(divLane => {
                const lx1 = p1.roadCenterX + divLane * p1.roadHalfW;
                const lx0 = p0.roadCenterX + divLane * p0.roadHalfW;
                const lw1 = Math.max(1.5, p1.roadHalfW * 0.018);
                const lw0 = Math.max(2.5, p0.roadHalfW * 0.018);
                ctx.beginPath();
                ctx.moveTo(lx1 - lw1, p1.sy);
                ctx.lineTo(lx1 + lw1, p1.sy);
                ctx.lineTo(lx0 + lw0, p0.sy);
                ctx.lineTo(lx0 - lw0, p0.sy);
                ctx.closePath();
                ctx.fill();
            });
        }

        const modZ = ((segIndex % CT_TRACK_LENGTH) + CT_TRACK_LENGTH) % CT_TRACK_LENGTH;

        // Render Twin Tire Skidmarks on Road Segments
        ctState.skidmarks.forEach(sk => {
            if (Math.floor(sk.z) === modZ && d > 1) {
                const skX = p0.roadCenterX + sk.laneX * p0.roadHalfW;
                const wheelSpread = 0.14 * p0.roadHalfW;
                ctx.fillStyle = `rgba(15, 23, 42, ${Math.min(0.65, sk.life / 60)})`;
                ctx.fillRect(skX - wheelSpread - 4 * p0.scale, p1.sy, Math.max(3, 9 * p0.scale), Math.max(3, p0.sy - p1.sy + 2));
                ctx.fillRect(skX + wheelSpread - 4 * p0.scale, p1.sy, Math.max(3, 9 * p0.scale), Math.max(3, p0.sy - p1.sy + 2));
            }
        });

        // ------------------------------------------------------------------
        // 3. DROP-OFF ZONE OR WAITING ROADSIDE PASSENGERS
        // ------------------------------------------------------------------
        if (ctState.seatedPassenger && ctState.dropOffZone) {
            // Render Glowing Destination Drop-Off Zone on the Shoulder
            if (modZ === Math.floor(ctState.dropOffZone.zPos) && d > 1) {
                const dzX = p0.roadCenterX + ctState.dropOffZone.side * p0.roadHalfW;
                const dzY = p0.sy;
                const ringW = p0.roadHalfW * 0.28;
                const ringH = Math.max(7, 22 * p0.scale);

                ctx.save();
                ctx.strokeStyle = '#fde047';
                ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
                ctx.lineWidth = Math.max(2.5, 6 * p0.scale);
                ctx.beginPath();
                ctx.ellipse(dzX, dzY, ringW, ringH, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                const beamH = 190 * p0.scale;
                const beamGrad = ctx.createLinearGradient(0, dzY - beamH, 0, dzY);
                beamGrad.addColorStop(0, 'rgba(250, 204, 21, 0)');
                beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0.55)');
                ctx.fillStyle = beamGrad;
                ctx.fillRect(dzX - ringW * 0.75, dzY - beamH, ringW * 1.5, beamH);

                if (p0.scale > 0.12) {
                    ctx.font = `900 ${Math.max(11, Math.round(21 * p0.scale))}px Impact, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = Math.max(2, 4 * p0.scale);
                    ctx.fillStyle = '#fde047';
                    const label = '🏁 DROP OFF HERE: ' + ctState.dropOffZone.destName;
                    ctx.strokeText(label, dzX, dzY - 85 * p0.scale);
                    ctx.fillText(label, dzX, dzY - 85 * p0.scale);
                }
                ctx.restore();
            }
        } else {
            // Render Waiting Passengers on Left & Right Shoulders
            ctState.passengers.forEach(passenger => {
                if (modZ === Math.floor(passenger.zPos) && d > 1) {
                    const px = p0.roadCenterX + passenger.side * p0.roadHalfW;
                    const py = p0.sy;
                    const ringW = p0.roadHalfW * 0.24;
                    const ringH = Math.max(6, 18 * p0.scale);

                    ctx.save();
                    ctx.strokeStyle = passenger.ringColor;
                    ctx.fillStyle = passenger.isProject ? 'rgba(250, 204, 21, 0.42)' : 'rgba(34, 197, 94, 0.36)';
                    ctx.lineWidth = Math.max(2, 5 * p0.scale);
                    ctx.beginPath();
                    ctx.ellipse(px, py, ringW, ringH, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    const beamH = (passenger.isProject ? 175 : 130) * p0.scale;
                    const beamGrad = ctx.createLinearGradient(0, py - beamH, 0, py);
                    beamGrad.addColorStop(0, 'rgba(74, 222, 128, 0)');
                    beamGrad.addColorStop(1, passenger.isProject ? 'rgba(250, 204, 21, 0.5)' : 'rgba(74, 222, 128, 0.42)');
                    ctx.fillStyle = beamGrad;
                    ctx.fillRect(px - ringW * 0.65, py - beamH, ringW * 1.3, beamH);

                    const pScale = p0.scale * 1.32;
                    if (pScale > 0.13) {
                        const waveAngle = Math.sin(Date.now() * 0.012 + passenger.zPos) * 0.6;
                        // Legs
                        ctx.strokeStyle = '#0f172a';
                        ctx.lineWidth = Math.max(2, 6 * pScale);
                        ctx.beginPath();
                        ctx.moveTo(px - 6 * pScale, py);
                        ctx.lineTo(px - 4 * pScale, py - 24 * pScale);
                        ctx.moveTo(px + 6 * pScale, py);
                        ctx.lineTo(px + 4 * pScale, py - 24 * pScale);
                        ctx.stroke();

                        // Shirt
                        ctx.fillStyle = passenger.shirtColor;
                        ctx.strokeStyle = '#000';
                        ctx.lineWidth = Math.max(1.5, 3 * pScale);
                        ctx.fillRect(px - 11 * pScale, py - 50 * pScale, 22 * pScale, 28 * pScale);
                        ctx.strokeRect(px - 11 * pScale, py - 50 * pScale, 22 * pScale, 28 * pScale);

                        // Waving Arm
                        ctx.strokeStyle = passenger.shirtColor;
                        ctx.lineWidth = Math.max(2, 5 * pScale);
                        ctx.beginPath();
                        ctx.moveTo(px - 11 * pScale, py - 45 * pScale);
                        ctx.lineTo(px - (24 + Math.sin(waveAngle) * 10) * pScale, py - (68 + Math.cos(waveAngle) * 8) * pScale);
                        ctx.stroke();

                        // Head
                        ctx.fillStyle = '#fde68a';
                        ctx.beginPath();
                        ctx.arc(px, py - 60 * pScale, 9 * pScale, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();

                        // Floating Overhead Label
                        ctx.font = `900 ${Math.max(10, Math.round(18 * p0.scale))}px Impact, sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.strokeStyle = '#000';
                        ctx.lineWidth = Math.max(2, 4 * p0.scale);
                        ctx.fillStyle = passenger.isProject ? '#fde047' : '#4ade80';
                        const tag = (passenger.isProject ? '⭐ ' : '🙋 ') + passenger.shortLabel;
                        ctx.strokeText(tag, px, py - 92 * pScale);
                        ctx.fillText(tag, px, py - 92 * pScale);
                    }
                    ctx.restore();
                }
            });
        }

        // Roadside Billboards every 25 segments
        if (Math.abs(segIndex) % 25 === 0 && d > 2) {
            const bbIdx = Math.abs(Math.floor(segIndex / 25)) % CT_BILLBOARDS.length;
            const bb = CT_BILLBOARDS[bbIdx];
            const side = (Math.abs(segIndex) % 50 === 0) ? -1 : 1;
            const bx = p0.roadCenterX + side * (p0.roadHalfW * 1.58);
            const bw = 235 * p0.scale;
            const bh = 102 * p0.scale;
            const by = p0.sy - bh - 45 * p0.scale;

            if (bw > 20) {
                ctx.save();
                ctx.fillStyle = '#1f2937';
                ctx.fillRect(bx - bw * 0.3, by + bh, Math.max(2, 8 * p0.scale), 46 * p0.scale);
                ctx.fillRect(bx + bw * 0.25, by + bh, Math.max(2, 8 * p0.scale), 46 * p0.scale);

                ctx.fillStyle = bb.bg;
                ctx.strokeStyle = bb.border;
                ctx.lineWidth = Math.max(2, 5 * p0.scale);
                ctx.fillRect(bx - bw / 2, by, bw, bh);
                ctx.strokeRect(bx - bw / 2, by, bw, bh);

                ctx.textAlign = 'center';
                ctx.fillStyle = '#fff';
                ctx.font = `900 ${Math.max(9, Math.round(21 * p0.scale))}px Impact, sans-serif`;
                ctx.fillText(bb.title, bx, by + bh * 0.46);
                ctx.fillStyle = '#fde047';
                ctx.font = `700 ${Math.max(7, Math.round(13 * p0.scale))}px "Plus Jakarta Sans", sans-serif`;
                ctx.fillText(bb.sub, bx, by + bh * 0.78);
                ctx.restore();
            }
        }

        // Palm Trees every 8 segments
        if (Math.abs(segIndex) % 8 === 0 && d > 1) {
            [-1, 1].forEach(side => {
                const tx = p0.roadCenterX + side * (p0.roadHalfW * 1.35);
                const ty = p0.sy;
                const th = 155 * p0.scale;
                if (th > 10) {
                    ctx.strokeStyle = '#78350f';
                    ctx.lineWidth = Math.max(2, 10 * p0.scale);
                    ctx.beginPath();
                    ctx.moveTo(tx, ty);
                    ctx.quadraticCurveTo(tx + side * 14 * p0.scale, ty - th * 0.5, tx + side * 8 * p0.scale, ty - th);
                    ctx.stroke();

                    const topX = tx + side * 8 * p0.scale;
                    const topY = ty - th;
                    ctx.strokeStyle = '#15803d';
                    ctx.lineWidth = Math.max(1.5, 5 * p0.scale);
                    [-44, -22, 20, 42].forEach(dx => {
                        ctx.beginPath();
                        ctx.moveTo(topX, topY);
                        ctx.quadraticCurveTo(topX + dx * p0.scale * 0.6, topY - 18 * p0.scale, topX + dx * p0.scale, topY + 12 * p0.scale);
                        ctx.stroke();
                    });
                }
            });
        }

        // Render 3-Lane Traffic Cars, Trucks & Construction Barriers (Obstacles!)
        ctState.obstacles.forEach(ob => {
            if (Math.floor(ob.z) === modZ && d > 1) {
                const cx = p0.roadCenterX + ob.lane * p0.roadHalfW;
                const cy = p0.sy;

                if (ob.kind === 'barrier') {
                    const bw = 110 * p0.scale;
                    const bh = 46 * p0.scale;
                    if (bw > 8) {
                        ctx.save();
                        ctx.fillStyle = 'rgba(0,0,0,0.45)';
                        ctx.fillRect(cx - bw * 0.52, cy - 3 * p0.scale, bw * 1.04, 7 * p0.scale);
                        // Orange & White striped hazard barrier
                        ctx.fillStyle = '#f97316';
                        ctx.strokeStyle = '#000';
                        ctx.lineWidth = Math.max(1.5, 3 * p0.scale);
                        ctx.fillRect(cx - bw / 2, cy - bh, bw, bh * 0.72);
                        ctx.strokeRect(cx - bw / 2, cy - bh, bw, bh * 0.72);
                        ctx.fillStyle = '#fef08a';
                        ctx.fillRect(cx - bw * 0.25, cy - bh, bw * 0.18, bh * 0.72);
                        ctx.fillRect(cx + bw * 0.1, cy - bh, bw * 0.18, bh * 0.72);
                        ctx.restore();
                    }
                } else {
                    const isTruck = ob.kind === 'truck';
                    const cw = (isTruck ? 112 : 96) * p0.scale;
                    const ch = (isTruck ? 78 : 54) * p0.scale;
                    if (cw > 8) {
                        ctx.save();
                        ctx.fillStyle = 'rgba(0,0,0,0.48)';
                        ctx.fillRect(cx - cw * 0.55, cy - 4 * p0.scale, cw * 1.1, 8 * p0.scale);
                        ctx.fillStyle = ob.color;
                        ctx.strokeStyle = '#000';
                        ctx.lineWidth = Math.max(1.2, 2.8 * p0.scale);
                        ctx.fillRect(cx - cw / 2, cy - ch, cw, ch);
                        ctx.strokeRect(cx - cw / 2, cy - ch, cw, ch);
                        ctx.fillStyle = '#0f172a';
                        ctx.fillRect(cx - cw * 0.38, cy - ch * 0.86, cw * 0.76, ch * 0.34);
                        // Red brake lights
                        ctx.fillStyle = '#ef4444';
                        ctx.fillRect(cx - cw * 0.44, cy - ch * 0.34, cw * 0.2, ch * 0.18);
                        ctx.fillRect(cx + cw * 0.24, cy - ch * 0.34, cw * 0.2, ch * 0.18);
                        ctx.restore();
                    }
                }
            }
        });
    }

    // ------------------------------------------------------------------
    // 4. GIANT SPINNING 3D DESTINATION ARROW (POINTS TO PASSENGER OR DROP-OFF)
    // ------------------------------------------------------------------
    let targetXForArrow = 0.0;
    let arrowColor = '#4ade80';
    if (ctState.seatedPassenger && ctState.dropOffZone) {
        targetXForArrow = ctState.dropOffZone.side;
        arrowColor = '#fde047';
    } else {
        const vip = ctState.passengers.find(p => p.isProject) || ctState.passengers[0];
        if (vip) targetXForArrow = vip.side;
    }

    const arrowX = w * 0.5;
    const arrowY = 122;
    const arrowAngle = Math.max(-0.75, Math.min(0.75, (targetXForArrow - ctState.playerX) * 0.55));

    ctx.save();
    ctx.translate(arrowX, arrowY);
    ctx.rotate(arrowAngle);
    const bounce = 1 + Math.sin(Date.now() * 0.008) * 0.06;
    ctx.scale(bounce, bounce);

    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(28, 2);
    ctx.lineTo(12, 2);
    ctx.lineTo(12, 30);
    ctx.lineTo(-12, 30);
    ctx.lineTo(-12, 2);
    ctx.lineTo(-28, 2);
    ctx.closePath();
    ctx.fill();

    ctx.translate(-3, -3);
    ctx.fillStyle = arrowColor;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(28, 2);
    ctx.lineTo(12, 2);
    ctx.lineTo(12, 30);
    ctx.lineTo(-12, 30);
    ctx.lineTo(-12, 2);
    ctx.lineTo(-28, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // ------------------------------------------------------------------
    // 5. CHUNKY GAMECUBE CONVERTIBLE TAXI (MOVES ACROSS ALL 3 LANES & SHOULDERS!)
    //    Driver = DENIZ (Left Seat) | Right Seat = Empty unless carrying a passenger!
    // ------------------------------------------------------------------
    const carProj = project(ctState.playerX, 2.0, ctState.z + 2.0);
    const cabX = carProj.sx;
    const cabY = h - 108 + Math.sin(ctState.z * 2.4) * 2;
    const totalTilt = ctState.steerVel * 2.6 + ctState.driftAngle;

    ctx.save();
    ctx.translate(cabX, cabY);

    // Render Drift Smoke & Yellow/Orange Sparks behind the rear tires
    ctState.particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.xOffset, pt.yOffset, pt.size, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.rotate(totalTilt);

    // Shadow directly on the road asphalt
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(0, 28, 88, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rear Chunky Wheels on the Asphalt
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.fillRect(-76, -4, 24, 30);
    ctx.strokeRect(-76, -4, 24, 30);
    ctx.fillRect(52, -4, 24, 30);
    ctx.strokeRect(52, -4, 24, 30);

    // Convertible Cab Main Body
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-72, 16);
    ctx.lineTo(72, 16);
    ctx.lineTo(64, -26);
    ctx.lineTo(-64, -26);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Black & White Checkered Side Stripe
    for (let i = -5; i < 5; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#000' : '#fff';
        ctx.fillRect(i * 12, -10, 12, 8);
    }

    // Convertible Red Leather Seats (Left = Driver, Right = Empty until pickup!)
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(-48, -36, 96, 12);
    ctx.strokeRect(-48, -36, 96, 12);

    // Windshield Frame
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(-44, -54, 88, 18);

    // Driver (Deniz Coban) in Left Seat
    const headShift = ctState.steerVel * 110;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-30 + headShift * 0.4, -42, 22, 12);
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(-19 + headShift, -48, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.textAlign = 'center';
    ctx.strokeText('DENIZ', -19 + headShift, -64);
    ctx.fillText('DENIZ', -19 + headShift, -64);

    // Seated Passenger in Right Seat (ONLY when a passenger has been picked up and not yet dropped off!)
    if (ctState.seatedPassenger) {
        ctx.fillStyle = ctState.seatedPassenger.shirtColor;
        ctx.fillRect(8, -42, 22, 12);
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(19, -48, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#4ade80';
        ctx.strokeText(ctState.seatedPassenger.isProject ? 'VIP PROJECT' : 'PASSENGER', 19, -64);
        ctx.fillText(ctState.seatedPassenger.isProject ? 'VIP PROJECT' : 'PASSENGER', 19, -64);
    }

    // Chrome Bumper & License Plate ("DENIZ-1")
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.fillRect(-68, 12, 136, 10);
    ctx.strokeRect(-68, 12, 136, 10);

    ctx.fillStyle = '#fde047';
    ctx.fillRect(-28, 2, 56, 13);
    ctx.strokeRect(-28, 2, 56, 13);
    ctx.fillStyle = '#000';
    ctx.font = '900 10px Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DENIZ-1', 0, 12);

    // Glowing Red Taillights
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-64, -20, 18, 10);
    ctx.strokeRect(-64, -20, 18, 10);
    ctx.fillRect(46, -20, 18, 10);
    ctx.strokeRect(46, -20, 18, 10);

    // Dual Exhaust Flames on Accelerate or Drift Boost
    if (ctState.keys.up || ctState.speed > 0.28) {
        [-38, 38].forEach(ex => {
            ctx.fillStyle = ctState.keys.space ? '#38bdf8' : '#f97316';
            ctx.beginPath();
            ctx.moveTo(ex - 7, 22);
            ctx.lineTo(ex + 7, 22);
            ctx.lineTo(ex, 38 + Math.random() * 14);
            ctx.closePath();
            ctx.fill();
        });
    }

    ctx.restore(); // Restore cab transform
    ctx.restore(); // Restore screen-shake transform

    ctState.animId = requestAnimationFrame(ctLoop);
}