import React, { useEffect } from 'react';
import './LoveLock.css';

function LoveLock({ onUnlock }) {
	useEffect(() => {
		// ==== Setup DOM references (after mount) ====
		const TARGET_CODE = [2, 1, 8, 0, 3];

		const dials = Array.from(document.querySelectorAll('.dial'));
		const digits = dials.map((d) => d.querySelector('.digit'));
		const upButtons = dials.map((d) => d.querySelector('.up'));
		const downButtons = dials.map((d) => d.querySelector('.down'));
		const lock3d = document.getElementById('lock3d');
		const lockCard = document.getElementById('lockCard');
		const loveMessage = document.getElementById('loveMessage');
		const loveOverlay = document.getElementById('loveOverlay');
		const scene = document.getElementById('scene');

		let values = [0, 0, 0, 0, 0];
		let audioCtx;
		let lastTickTime = 0;
		let tickPlaybackRate = 1;

		function clampDigit(n) {
			return (n + 10) % 10;
		}
		function render() {
			digits.forEach((d, i) => {
				if (!d) return;
				d.textContent = String(values[i]);
				d.dataset.value = String(values[i]);
			});
		}

		function nudge(index, delta) {
			values[index] = clampDigit(values[index] + delta);
			render();
			wobble(index, delta);
			playTick();
		}

		function wobble(index, delta) {
			const digitEl = digits[index];
			if (!digitEl || !digitEl.animate) return;
			digitEl.animate(
				[
					{ transform: 'rotateX(0deg)', opacity: 1 },
					{ transform: `rotateX(${delta > 0 ? -70 : 70}deg)`, opacity: 0.4 },
					{ transform: 'rotateX(0deg)', opacity: 1 },
				],
				{ duration: 160, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', transformOrigin: '50% 50%' }
			);
		}

		function pulse(el) {
			if (!el || !el.animate) return;
			el.animate(
				[
					{ transform: 'scale(1)' },
					{ transform: 'scale(1.04)' },
					{ transform: 'scale(1)' },
				],
				{ duration: 220, easing: 'ease-out' }
			);
		}

		function ensureAudio() {
			if (!audioCtx) {
				try {
					audioCtx = new (window.AudioContext || window.webkitAudioContext)();
				} catch {}
			}
		}

		function playTick() {
			ensureAudio();
			if (!audioCtx) return;
			const now = audioCtx.currentTime;
			const dt = now - lastTickTime;
			lastTickTime = now;
			tickPlaybackRate = Math.min(1.6, 0.9 + (1 / Math.max(0.05, dt)) * 0.04);

			const osc = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			const filter = audioCtx.createBiquadFilter();
			filter.type = 'lowpass';
			filter.frequency.value = 2200;
			osc.type = 'triangle';
			osc.frequency.setValueAtTime(480 * tickPlaybackRate, now);
			gain.gain.setValueAtTime(0.0001, now);
			gain.gain.exponentialRampToValueAtTime(0.08, now + 0.005);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
			osc.connect(filter);
			filter.connect(gain);
			gain.connect(audioCtx.destination);
			osc.start(now);
			osc.stop(now + 0.08);
		}

		function shake(el) {
			if (!el || !el.animate) return;
			el.animate(
				[
					{ transform: 'translateX(0)' },
					{ transform: 'translateX(-6px)' },
					{ transform: 'translateX(6px)' },
					{ transform: 'translateX(-4px)' },
					{ transform: 'translateX(4px)' },
					{ transform: 'translateX(0)' },
				],
				{ duration: 360, easing: 'ease-in-out' }
			);
		}

		function fireConfetti() {
			spawnConfetti(160);
		}

		function animateShine() {
			if (!lock3d || !lock3d.animate) return;
			lock3d.animate(
				[
					{ filter: 'drop-shadow(0 10px 24px rgba(255, 61, 110, 0.25))' },
					{ filter: 'drop-shadow(0 10px 24px rgba(255, 61, 110, 0.6))' },
					{ filter: 'drop-shadow(0 10px 24px rgba(255, 61, 110, 0.25))' },
				],
				{ duration: 900, easing: 'ease-in-out' }
			);
			spawnHearts(18);
		}

		function checkUnlock() {
			const isCorrect = values.every((v, i) => v === TARGET_CODE[i]);
			if (!isCorrect) {
				lockCard && lockCard.classList.remove('unlocked');
				if (loveMessage) {
					loveMessage.hidden = true;
					loveMessage.classList.remove('show');
				}
				try { navigator.vibrate && navigator.vibrate(80); } catch {}
				shake(lockCard);
				return false;
			}

			lockCard && lockCard.classList.add('unlocked');
			pulse(lock3d);
			fireConfetti();
			if (loveMessage) {
				loveMessage.hidden = false;
				requestAnimationFrame(() => loveMessage.classList.add('show'));
			}
			animateShine();
			try { navigator.vibrate && navigator.vibrate([30, 60, 30]); } catch {}

			startMorphToHeart();

			// Trigger unlocking of HBD screen shortly after success animation starts
			setTimeout(() => {
				onUnlock && onUnlock();
			}, 4000);
			return true;
		}

		function setFromQuery() {
			const params = new URLSearchParams(window.location.search);
			const code = params.get('code');
			if (code && /^\d{5}$/.test(code)) {
				values = code.split('').map((c) => Number(c));
				render();
			}
		}

		// Parallax
		function handleMouseMove(e) {
			if (!lockCard) return;
			const rect = lockCard.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width - 0.5;
			const y = (e.clientY - rect.top) / rect.height - 0.5;
			lockCard.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
		}
		function handleMouseLeave() {
			if (!lockCard) return;
			lockCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
		}
		scene && scene.addEventListener('mousemove', handleMouseMove);
		scene && scene.addEventListener('mouseleave', handleMouseLeave);

		// Bind buttons and interactions
		upButtons.forEach((btn, i) => {
			if (!btn) return;
			let holdInt;
			let holdTimeout;
			let holdStarted = false;
			let isPressing = false;
			let activePointerId = null;
			const startHold = () => {
				holdStarted = true;
				nudge(i, +1);
				checkUnlock();
				holdInt = setInterval(() => {
					nudge(i, +1);
					checkUnlock();
				}, 120);
			};
			const clearHold = () => {
				if (holdTimeout) { clearTimeout(holdTimeout); holdTimeout = null; }
				if (holdInt) { clearInterval(holdInt); holdInt = null; }
			};
			btn.addEventListener('pointerdown', (e) => {
				isPressing = true;
				activePointerId = e.pointerId;
				holdStarted = false;
				holdTimeout = setTimeout(startHold, 300);
				if (btn.setPointerCapture) btn.setPointerCapture(e.pointerId);
			});
			const release = (e) => {
				if (!isPressing) return;
				if (e && activePointerId !== null && e.pointerId !== activePointerId) return;
				const wasHold = holdStarted;
				isPressing = false;
				activePointerId = null;
				clearHold();
				if (!wasHold) {
					nudge(i, +1);
					checkUnlock();
				}
			};
			btn.addEventListener('pointerup', release);
			btn.addEventListener('pointerleave', release);
			btn.addEventListener('pointercancel', release);
			btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); });
		});

		downButtons.forEach((btn, i) => {
			if (!btn) return;
			let holdInt;
			let holdTimeout;
			let holdStarted = false;
			let isPressing = false;
			let activePointerId = null;
			const startHold = () => {
				holdStarted = true;
				nudge(i, -1);
				checkUnlock();
				holdInt = setInterval(() => {
					nudge(i, -1);
					checkUnlock();
				}, 120);
			};
			const clearHold = () => {
				if (holdTimeout) { clearTimeout(holdTimeout); holdTimeout = null; }
				if (holdInt) { clearInterval(holdInt); holdInt = null; }
			};
			btn.addEventListener('pointerdown', (e) => {
				isPressing = true;
				activePointerId = e.pointerId;
				holdStarted = false;
				holdTimeout = setTimeout(startHold, 300);
				if (btn.setPointerCapture) btn.setPointerCapture(e.pointerId);
			});
			const release = (e) => {
				if (!isPressing) return;
				if (e && activePointerId !== null && e.pointerId !== activePointerId) return;
				const wasHold = holdStarted;
				isPressing = false;
				activePointerId = null;
				clearHold();
				if (!wasHold) {
					nudge(i, -1);
					checkUnlock();
				}
			};
			btn.addEventListener('pointerup', release);
			btn.addEventListener('pointerleave', release);
			btn.addEventListener('pointercancel', release);
			btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); });
		});

		// Keyboard, wheel, and drag support on dials
		dials.forEach((dial, i) => {
			if (!dial) return;
			dial.addEventListener('click', (ev) => {
				const upEl = ev.target.closest('.up');
				const downEl = ev.target.closest('.down');
				if (upEl) { nudge(i, +1); checkUnlock(); return; }
				if (downEl) { nudge(i, -1); checkUnlock(); return; }
				const rect = dial.getBoundingClientRect();
				const y = ev.clientY - rect.top;
				if (y < rect.height / 2) { nudge(i, +1); } else { nudge(i, -1); }
				checkUnlock();
			});

			dial.addEventListener('keydown', (ev) => {
				if (ev.key === 'ArrowUp') { nudge(i, +1); ev.preventDefault(); checkUnlock(); }
				if (ev.key === 'ArrowDown') { nudge(i, -1); ev.preventDefault(); checkUnlock(); }
				if (ev.key === 'Enter') { checkUnlock(); ev.preventDefault(); }
			});

			dial.addEventListener('wheel', (ev) => {
				ev.preventDefault();
				const step = Math.sign(-ev.deltaY);
				if (step !== 0) { nudge(i, step); checkUnlock(); }
			}, { passive: false });

			let startY = 0;
			let acc = 0;
			let dragging = false;
			const STEP_PX = 18;
			dial.addEventListener('pointerdown', (ev) => {
				if (ev.target.closest('.arrow')) return;
				dragging = true; startY = ev.clientY; acc = 0;
				dial.setPointerCapture(ev.pointerId);
				dial.classList.add('active');
			});
			dial.addEventListener('pointermove', (ev) => {
				if (!dragging) return;
				const dy = startY - ev.clientY;
				const steps = Math.trunc((dy - acc) / STEP_PX);
				if (steps !== 0) { acc += steps * STEP_PX; nudge(i, steps); checkUnlock(); }
			});
			dial.addEventListener('pointerup', () => { dragging = false; acc = 0; dial.classList.remove('active'); });
			dial.addEventListener('pointercancel', () => { dragging = false; acc = 0; dial.classList.remove('active'); });
		});

		// Canvases
		const confettiCanvas = document.getElementById('confettiCanvas');
		const heartsCanvas = document.getElementById('heartsCanvas');
		const morphCanvas = document.getElementById('morphCanvas');
		const DPR = Math.min(2, window.devicePixelRatio || 1);

		function fitCanvas(canvas) {
			if (!canvas) return;
			const { innerWidth: w, innerHeight: h } = window;
			canvas.width = Math.floor(w * DPR);
			canvas.height = Math.floor(h * DPR);
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
		}
		fitCanvas(confettiCanvas);
		fitCanvas(heartsCanvas);
		fitCanvas(morphCanvas);
		const handleResize = () => {
			fitCanvas(confettiCanvas);
			fitCanvas(heartsCanvas);
			fitCanvas(morphCanvas);
			render();
			heartTargets = buildHeartTargets();
		};
		window.addEventListener('resize', handleResize);

		// Background particles
		const bg = document.getElementById('bgParticles');
		if (bg && bg.children.length === 0) {
			const COUNT = 60;
			for (let i = 0; i < COUNT; i++) {
				const el = document.createElement('div');
				el.className = 'particle';
				el.style.left = Math.random() * 100 + 'vw';
				el.style.animationDelay = (Math.random() * 20).toFixed(2) + 's';
				el.style.animationDuration = (16 + Math.random() * 16).toFixed(2) + 's';
				el.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
				bg.appendChild(el);
			}
		}

		// Confetti
		let confetti = [];
		function spawnConfetti(burst = 120) {
			if (!confettiCanvas) return;
			const cw = confettiCanvas.width;
			const ch = confettiCanvas.height;
			for (let i = 0; i < burst; i++) {
				confetti.push({
					x: cw / 2,
					y: ch * 0.25,
					vx: (Math.random() - 0.5) * 6 * DPR,
					vy: (Math.random() * -6 - 2) * DPR,
					g: 0.15 * DPR,
					hue: 330 + Math.random() * 40,
					size: 3 + Math.random() * 3,
					life: 100 + Math.random() * 60,
				});
			}
		}

		function drawConfetti(ctx) {
			confetti = confetti.filter((c) => c.life > 0);
			for (const c of confetti) {
				c.x += c.vx; c.y += c.vy; c.vy += c.g; c.life -= 1;
				ctx.save(); ctx.translate(c.x, c.y);
				ctx.rotate((c.x + c.y) * 0.01);
				ctx.fillStyle = `hsl(${c.hue}deg 90% 60% / 0.95)`;
				ctx.fillRect(-c.size, -c.size, c.size * 2, c.size * 2);
				ctx.restore();
			}
		}

		// Hearts
		let hearts = [];
		function spawnHearts(count = 12) {
			if (!heartsCanvas) return;
			const w = heartsCanvas.width; const h = heartsCanvas.height;
			for (let i = 0; i < count; i++) {
				const x = Math.random() * w; const y = h + Math.random() * 60;
				hearts.push({
					x,
					y,
					vx: (Math.random() - 0.5) * 0.6 * DPR,
					vy: -(1.2 + Math.random() * 0.8) * DPR,
					size: 10 + Math.random() * 14,
					alpha: 0.6 + Math.random() * 0.4,
				});
			}
		}

		function drawHeart(ctx, x, y, size, color, alpha) {
			ctx.save(); ctx.translate(x, y); ctx.scale(size, size);
			ctx.beginPath();
			ctx.moveTo(0, -0.5);
			ctx.bezierCurveTo(0.5, -1.2, 1.8, -0.1, 0, 1);
			ctx.bezierCurveTo(-1.8, -0.1, -0.5, -1.2, 0, -0.5);
			ctx.fillStyle = `rgba(255, 61, 110, ${alpha})`;
			ctx.fill(); ctx.restore();
		}

		function drawHearts(ctx) {
			hearts = hearts.filter((h) => h.y > -40);
			for (const h of hearts) { h.x += h.vx; h.y += h.vy; drawHeart(ctx, h.x, h.y, h.size, '#ff3d6e', h.alpha); }
		}

		// Morph to heart
		let morphState = { active: false, t: 0 };
		let particles = [];
		const PARTICLE_COUNT = 600;

		function createParticles() {
			const w = morphCanvas ? morphCanvas.width : 0;
			const h = morphCanvas ? morphCanvas.height : 0;
			particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
				x: Math.random() * w,
				y: Math.random() * h,
				vx: (Math.random() - 0.5) * 0.3 * DPR,
				vy: (Math.random() - 0.5) * 0.3 * DPR,
				tx: 0,
				ty: 0,
				size: 1 + Math.random() * 2,
				hue: 330 + Math.random() * 40,
			}));
		}
		createParticles();

		function heartPoint(u, v, scale = 1) {
			const x = 16 * Math.pow(Math.sin(u), 3);
			const y = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
			return { x: x * scale + v.x, y: -y * scale + v.y };
		}

		function buildHeartTargets() {
			const w = morphCanvas ? morphCanvas.width : 0;
			const h = morphCanvas ? morphCanvas.height : 0;
			const center = { x: w / 2, y: h / 2 };
			const scale = Math.min(w, h) * 0.02;
			const targets = [];
			for (let i = 0; i < particles.length; i++) {
				const u = (i / particles.length) * Math.PI * 2;
				const p = heartPoint(u, center, scale);
				targets.push(p);
			}
			return targets;
		}

		let heartTargets = buildHeartTargets();

		function startMorphToHeart() {
			morphState.active = true; morphState.t = 0;
			document.getElementById('scene')?.classList.add('fade-out');
			if (loveOverlay) { loveOverlay.hidden = false; requestAnimationFrame(() => loveOverlay.classList.add('show')); }
		}

		function drawMorph(ctx) {
			if (!morphState.active) return;
			const w = morphCanvas ? morphCanvas.width : 0;
			const h = morphCanvas ? morphCanvas.height : 0;
			ctx.clearRect(0, 0, w, h);
			morphState.t = Math.min(1, morphState.t + 0.008);
			const ease = (t) => 1 - Math.pow(1 - t, 3);
			const t = ease(morphState.t);
			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				const target = heartTargets[i % heartTargets.length];
				p.x += (target.x - p.x) * (0.03 + t * 0.08);
				p.y += (target.y - p.y) * (0.03 + t * 0.08);
				ctx.fillStyle = `hsla(${p.hue}deg, 90%, ${60 + Math.sin(i) * 10}%, ${0.35 + 0.45 * t})`;
				ctx.beginPath(); ctx.arc(p.x, p.y, p.size * DPR * (0.8 + t), 0, Math.PI * 2); ctx.fill();
			}
		}

		// Main loop
		const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
		const heartsCtx = heartsCanvas ? heartsCanvas.getContext('2d') : null;
		const morphCtx = morphCanvas ? morphCanvas.getContext('2d') : null;
		let rafId;
		function loop() {
			if (confettiCtx && confettiCanvas) confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
			if (heartsCtx && heartsCanvas) heartsCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
			if (confettiCtx) drawConfetti(confettiCtx);
			if (heartsCtx) drawHearts(heartsCtx);
			if (morphCtx) drawMorph(morphCtx);
			rafId = requestAnimationFrame(loop);
		}

		// Init
		setFromQuery();
		render();
		loop();

		// Cleanup
		return () => {
			try { rafId && cancelAnimationFrame(rafId); } catch {}
			window.removeEventListener('resize', handleResize);
			scene && scene.removeEventListener('mousemove', handleMouseMove);
			scene && scene.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, [onUnlock]);

	return (
		<main className="scene" id="scene">
			<div className="bg-particles" id="bgParticles" aria-hidden="true"></div>
			<canvas id="confettiCanvas" aria-hidden="true"></canvas>
			<canvas id="heartsCanvas" aria-hidden="true"></canvas>
			<canvas id="morphCanvas" aria-hidden="true"></canvas>

			<header className="hero">
				<h1><span className="script">Love</span> Lock</h1>
			</header>

			<section className="lock-card" id="lockCard" aria-label="Love Lock">
				<div className="lock-3d" id="lock3d" role="img" aria-label="กุญแจรูปหัวใจ">
					<svg className="lock-svg" viewBox="0 0 200 260" width="260" height="260" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="bodyGrad" x1="0" x2="1">
								<stop offset="0%" stopColor="#ff6a88" />
								<stop offset="100%" stopColor="#ff99ac" />
							</linearGradient>
							<linearGradient id="metal" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="#eef2f3" />
								<stop offset="50%" stopColor="#cfd9df" />
								<stop offset="100%" stopColor="#eef2f3" />
							</linearGradient>
							<radialGradient id="gloss" cx="50%" cy="0%" r="80%">
								<stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
								<stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
							</radialGradient>
							<filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
								<feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#ff2d55" floodOpacity="0.25" />
							</filter>
							<filter id="inner" x="-20%" y="-20%" width="140%" height="140%">
								<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
								<feOffset dy="2" result="offset" />
								<feComposite in="offset" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="innerShadow" />
								<feColorMatrix in="innerShadow" type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.02  0 0 0 0 0.12  0 0 0 0.9 0" />
								<feComposite in2="SourceGraphic" operator="over" />
							</filter>
						</defs>

						<g id="shackle" className="shackle" filter="url(#softShadow)">
							<path d="M50,90 C50,40 80,20 100,20 C120,20 150,40 150,90 L150,120 L130,120 L130,90 C130,60 115,50 100,50 C85,50 70,60 70,90 L70,120 L50,120 Z" fill="url(#metal)" />
						</g>

						<g id="body" className="body" filter="url(#inner)">
							<rect x="30" y="110" rx="22" ry="22" width="140" height="120" fill="url(#bodyGrad)" />
							<ellipse cx="100" cy="132" rx="60" ry="18" fill="url(#gloss)" opacity="0.35" />
							<path d="M100 170 a20 20 0 1 0 0.0001 0" fill="#ff2d55" opacity="0.18" />
							<circle cx="100" cy="170" r="12" fill="#2d0b16" />
							<rect x="96" y="160" width="8" height="18" rx="4" fill="#0b0204" />
						</g>
					</svg>
					<div className="dials" role="group" aria-label="ใส่เลขรหัส 5 หลักบนกุญแจ">
						{[0,1,2,3,4].map((idx) => (
							<div className="dial" data-index={idx} aria-label={`หลักที่ ${idx+1}`} tabIndex={0} key={idx}>
								<button className="arrow up" aria-label="เพิ่มเลข">▲</button>
								<div className="digit" data-value="0">0</div>
								<div className="reel"><div className="reel-track">
									{[0,1,2,3,4,5,6,7,8,9].map((n) => (
										<div className="reel-num" key={n}>{n}</div>
									))}
								</div></div>
								<button className="arrow down" aria-label="ลดเลข">▼</button>
							</div>
						))}
					</div>
				</div>

				<div className="love-message" id="loveMessage" hidden>
					<h2 className="script">Locked in Love</h2>
				</div>
			</section>

			<div className="love-overlay" id="loveOverlay" hidden>
			</div>
		</main>
	);
}

export default LoveLock;


