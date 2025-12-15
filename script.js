document.addEventListener('DOMContentLoaded', () => {
    
    const MOBILE_BREAKPOINT = 768; 
    
    // Select all existing elements
    const fileItems = document.querySelectorAll('.file-item');
    const sections = document.querySelectorAll('.cli-section');
    const activeTab = document.getElementById('active-tab');
    const cliInput = document.getElementById('cli-input');
    const cliHistory = document.getElementById('cli-history');
    const overviewScreen = document.getElementById('initial-overview');
    const mainPortfolio = document.getElementById('portfolio-main');
    const terminalOutput = document.getElementById('terminal-output');
    const sidebar = document.getElementById('sidebar');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');

    // NEW ELEMENTS
    const accessButton = document.getElementById('access-button');
    const loadingBar = document.querySelector('.loading-bar');

    // --- 0. INITIAL OVERVIEW SEQUENCE ---
    const OVERVIEW_DURATION_MS = 5000; 

    function finalizeTransition() {
        accessButton.classList.add('clicking');
        
        setTimeout(() => {
            overviewScreen.classList.add('hidden');
            mainPortfolio.classList.add('visible');
            
            setTimeout(() => {
                cliInput.focus();
            }, 300);

        }, 300); 
    }

    // After the loading bar finishes (5 seconds)
    setTimeout(() => {
        if(loadingBar) loadingBar.classList.add('hidden');
        if(accessButton) accessButton.classList.add('visible');
        
        setTimeout(() => {
            if (overviewScreen && !overviewScreen.classList.contains('hidden')) {
                finalizeTransition();
            }
        }, 1000); 

    }, OVERVIEW_DURATION_MS);
    
    if(accessButton) accessButton.addEventListener('click', finalizeTransition);

    // --- MOBILE NAVIGATION LOGIC ---
    if(mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    function closeSidebarOnMobile() {
        if (window.innerWidth <= MOBILE_BREAKPOINT && sidebar) {
            sidebar.classList.remove('open');
        }
    }
    
    // --- PROJECT DETAILS ---
    const projectDetails = {
        carease: {
            title: 'CarEase - Car Rental Platform',
            description: 'A comprehensive Java Spring Boot-based car rental platform that revolutionizes the vehicle rental experience. Features include intelligent vehicle search with advanced filtering, dynamic pricing calculator, sophisticated booking system with conflict resolution, and integrated wallet payment functionality. The system includes automated vehicle availability management, real-time notifications, user authentication, and a comprehensive admin dashboard for fleet management.',
            link: 'https://drive.google.com/drive/folders/10UTWe4BlCowxywpZAhRO5hclckrsTh_u?usp=drive_link'
        },
        vault: {
            title: 'Vault - Banking System',
            description: 'An enterprise-grade banking platform built with Spring Boot, featuring secure role-based dashboards for administrators and customers. The system integrates Custom payment gateway for seamless transactions, comprehensive account services including deposits, withdrawals, and transfers, detailed transaction history APIs with filtering capabilities, and complete microservices architecture. Platform uses MySQL, SMTP email services, and robust security implementation.',
            link: 'https://drive.google.com/drive/folders/10UTWe4BlCowxywpZAhRO5hclckrsTh_u?usp=drive_link'
        },
        portfolio: {
            title: 'Developer Portfolio Website',
            description: 'A modern, responsive portfolio website built with semantic HTML5, advanced CSS3 features (like glassmorphism design), and vanilla JavaScript for smooth interactions and optimized performance across all devices.',
            link: '#'
        }
    };
    
    // --- 1. DYNAMIC SECTION CREATION & NAVIGATION SETUP ---
    
    // Only create sections if they don't already exist
    const workCards = Array.from(document.querySelectorAll('#experience .exp-card[data-type="work"]')).map(card => card.outerHTML).join('');
    const eduCertCards = Array.from(document.querySelectorAll('#experience .exp-card[data-type="education"]')).map(card => card.outerHTML).join('');
    
    // Hide original experience section
    const originalExperienceSection = document.getElementById('experience');
    if (originalExperienceSection) {
        originalExperienceSection.style.display = 'none';
    }

    // Create work experience section if it doesn't exist
    if (!document.getElementById('experience-work') && workCards) {
        const workExperienceSection = document.createElement('section');
        workExperienceSection.id = 'experience-work';
        workExperienceSection.classList.add('cli-section');
        workExperienceSection.innerHTML = `
            <h3 class="section-title">WORK EXPERIENCE & ACHIEVEMENTS</h3>
            ${workCards}
        `;
        const projectsSection = document.getElementById('projects');
        if (projectsSection && terminalOutput) {
            terminalOutput.insertBefore(workExperienceSection, projectsSection);
        }
    }

    // Create education section if it doesn't exist
    if (!document.getElementById('education') && eduCertCards) {
        const educationSection = document.createElement('section');
        educationSection.id = 'education';
        educationSection.classList.add('cli-section');
        educationSection.innerHTML = `
            <h3 class="section-title">EDUCATION & CERTIFICATIONS</h3>
            ${eduCertCards}
        `;
        const projectsSection = document.getElementById('projects');
        if (projectsSection && terminalOutput) {
            terminalOutput.insertBefore(educationSection, projectsSection);
        }
    }
    
    // Get all file items after potential DOM modifications
    const newFileItems = document.querySelectorAll('.file-item');
    const newSections = document.querySelectorAll('.cli-section');

    function showSection(sectionId, fileName) {
        newSections.forEach(sec => {
            sec.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            const scrollArea = window.innerWidth > MOBILE_BREAKPOINT ? terminalOutput : mainPortfolio;
            const scrollOffset = window.innerWidth > MOBILE_BREAKPOINT ? 20 : 0; 
            
            if (scrollArea) {
                // Smooth scrolling
                scrollArea.scrollTo({
                    top: targetSection.offsetTop - scrollOffset,
                    behavior: 'smooth'
                });
            }
        }

        if (activeTab) {
            activeTab.querySelector('.filename').textContent = fileName;
        }
    }

    // Update the file item click event listeners
    newFileItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            newFileItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const sectionId = item.getAttribute('data-section');
            const fileName = item.getAttribute('data-filename');
            showSection(sectionId, fileName);
            
            // Close sidebar on mobile
            closeSidebarOnMobile();
        });
    });

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                executeCommand(`cat ${projectId}`);
                return;
            }
            cliInput.value = `cat ${projectId}`;
            cliInput.focus();
        });
    });

    // --- 2. INTERACTIVE CLI LOGIC ---
    function executeCommand(command) {
        const historyElement = document.createElement('div');
        historyElement.innerHTML = `<div class="cli-prompt"><span class="cli-user">sandeep@portfolio</span>:<span class="cli-dir">~</span>$ ${command}</div>`;

        let response = '';
        let targetSection = null;

        switch (command.trim().toLowerCase()) {
            case 'whois sandeep?':
            case 'about':
                targetSection = 'about';
                response = `<pre class="cli-history-output">// Executing 'whois' command...
-> Displaying about.ts.
Status: Success.</pre>`;
                break;
            case 'show --projects':
            case 'projects':
                targetSection = 'projects';
                response = `<pre class="cli-history-output">// Running 'show --projects' command...
-> Listing projects.java.
Status: Success.</pre>`;
                break;
            case 'show --experience':
            case 'experience':
                targetSection = 'experience-work'; 
                response = `<pre class="cli-history-output">// Running 'show --experience' command...
-> Fetching experience.log.
Status: Success.</pre>`;
                break;
            case 'show --education': 
            case 'education':
                targetSection = 'education'; 
                response = `<pre class="cli-history-output">// Running 'show --education' command...
-> Fetching education.cert.
Status: Success.</pre>`;
                break;
            case 'sudo hire sandeep':
            case 'contact':
                targetSection = 'contact';
                response = `<pre class="cli-history-output">// Running 'sudo hire sandeep' command...
-> Initiating contact.sh.
Status: READY FOR HIRE</pre>`;
                break;
            case 'cat carease':
            case 'cat vault':
            case 'cat portfolio':
                const projectId = command.trim().split(' ')[1];
                if (projectDetails[projectId]) {
                    response = `<pre class="cli-history-output">File: ${projectDetails[projectId].title}
------------------------------------
Description: ${projectDetails[projectId].description}
Link: ${projectDetails[projectId].link}
------------------------------------
Status: Read complete.</pre>`;
                } else {
                    response = `<pre class="cli-history-output">Error: File not found or unknown project ID.</pre>`;
                }
                targetSection = 'projects';
                break;

            case 'clear':
                cliHistory.innerHTML = '';
                return;
            case 'help':
                response = `<pre class="cli-history-output">Available Commands:
- whois sandeep? / about
- show --experience / experience (Work)
- show --education / education (Education/Certifications)
- show --projects / projects
- sudo hire sandeep / contact
- cat [carease | vault | portfolio] (View project details)
- clear
- help</pre>`;
                break;
            default:
                response = `<pre class="cli-history-output">Error: Command not found: ${command}. Type 'help' for available commands.</pre>`;
                targetSection = null;
        }

        historyElement.innerHTML += response;
        cliHistory.appendChild(historyElement);
        
        cliHistory.scrollTop = cliHistory.scrollHeight;

        if (targetSection) {
            const targetItem = document.querySelector(`.file-item[data-section="${targetSection}"]`);
            if (targetItem) {
                newFileItems.forEach(i => i.classList.remove('active'));
                targetItem.classList.add('active');
                showSection(targetSection, targetItem.getAttribute('data-filename'));
                
                // Close sidebar when navigating via commands
                closeSidebarOnMobile();
            }
        }
    }

    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = cliInput.value.trim();
            if (command) {
                executeCommand(command);
            }
            cliInput.value = '';
        }
    });

    // Initialize with first section
    const initialItem = document.querySelector('.file-item.active');
    if (initialItem) {
        showSection(initialItem.getAttribute('data-section'), initialItem.getAttribute('data-filename'));
    }

    // --- 3. 3D WAVE CANVAS LOGIC ---
    const canvas = document.getElementById('wave-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let dots = [];
        
        const DESKTOP_GRID_SIZE = 30; 
        const MOBILE_GRID_SIZE = 15; 
        
        function getGridSize() {
            return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_GRID_SIZE : DESKTOP_GRID_SIZE;
        }

        const WAVE_AMPLITUDE = 20;
        const WAVE_SPEED = 0.005;
        const PERSPECTIVE_FACTOR = 0.65;
        const COVERAGE_FACTOR = 1.6;
        const LINE_MAX_DISTANCE = 150; 
        const RIPPLE_RADIUS = 100;
        const RIPPLE_FORCE = 30;
        let animationFrameId;
        let mouseX = -999;
        let mouseY = -999;
        
        const body = document.body; 

        class Dot {
            constructor(gridX, gridY) {
                this.gridX = gridX;
                this.gridY = gridY;
                this.baseRadius = 1.5;
                this.screenX = 0;
                this.screenY = 0;
                this.wobbleOffset = Math.random() * 20;
            }

            calculatePosition(centerX, centerY, offsetTime, currentGridSize) {
                const normalizedY = this.gridY / currentGridSize;
                const depth = 1 - normalizedY;
                const scale = 1 - depth * PERSPECTIVE_FACTOR;
                const radius = this.baseRadius * scale;

                const turbulenceY = Math.sin(offsetTime * 0.01 + this.wobbleOffset) * 2 * scale;

                let waveY = Math.sin((this.gridX + this.gridY) * 0.5 + offsetTime * WAVE_SPEED) * WAVE_AMPLITUDE * scale;
                waveY += turbulenceY;

                this.screenX = centerX + (this.gridX - currentGridSize / 2) * (canvas.width / currentGridSize) * scale * COVERAGE_FACTOR;
                this.screenY = centerY + (this.gridY - currentGridSize / 2) * (canvas.height / currentGridSize) * scale * COVERAGE_FACTOR + waveY;

                const distSq = Math.pow(this.screenX - mouseX, 2) + Math.pow(this.screenY - mouseY, 2);

                if (distSq < RIPPLE_RADIUS * RIPPLE_RADIUS) {
                    const dist = Math.sqrt(distSq);
                    const force = (1 - (dist / RIPPLE_RADIUS));
                    this.screenY -= force * RIPPLE_FORCE;
                }

                return { radius, waveY, scale };
            }

            draw(centerX, centerY, offsetTime, currentGridSize) {
                const { radius, waveY, scale } = this.calculatePosition(centerX, centerY, offsetTime, currentGridSize);

                if (radius < 0.1) return;

                const dotColorStr = getComputedStyle(body).getPropertyValue('--wave-dot-color').trim();
                const shadowColor = getComputedStyle(body).getPropertyValue('--wave-shadow-color');

                ctx.globalAlpha = scale * 0.9;

                const normalizedWaveHeight = Math.abs(waveY) / WAVE_AMPLITUDE;

                // Conditional shadow application/blur reduction for performance
                if (window.innerWidth > MOBILE_BREAKPOINT) { 
                    ctx.shadowBlur = radius * 7 * normalizedWaveHeight * scale;
                    ctx.shadowColor = shadowColor;
                } else {
                    ctx.shadowBlur = radius * 3 * normalizedWaveHeight * scale; 
                    ctx.shadowColor = shadowColor;
                }

                ctx.beginPath();
                ctx.arc(this.screenX, this.screenY, radius, 0, Math.PI * 2, false);
                ctx.fillStyle = dotColorStr;
                ctx.fill();

                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';
                ctx.globalAlpha = 1;
            }
        }

        function initDots(currentGridSize) {
            dots = [];
            for (let y = 0; y < currentGridSize; y++) {
                for (let x = 0; x < currentGridSize; x++) {
                    dots.push(new Dot(x, y));
                }
            }
        }

        function drawLines(currentGridSize) {
            const lineColor = getComputedStyle(body).getPropertyValue('--wave-line-color');
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            
            const totalDots = currentGridSize * currentGridSize;

            for (let i = 0; i < dots.length; i++) {
                const currentDot = dots[i];
                
                // Check for connection to the right
                const rightIndex = i + 1;
                if (currentDot.gridX < currentGridSize - 1 && rightIndex < totalDots) {
                    const rightDot = dots[rightIndex];
                    if (rightDot) { 
                        connectDots(currentDot, rightDot, currentGridSize);
                    }
                }

                // Check for connection to the bottom
                const bottomIndex = i + currentGridSize;
                if (currentDot.gridY < currentGridSize - 1 && bottomIndex < totalDots) {
                    const bottomDot = dots[bottomIndex];
                    if (bottomDot) { 
                        connectDots(currentDot, bottomDot, currentGridSize);
                    }
                }
            }
        }

        function connectDots(dotA, dotB, currentGridSize) {
            const dist = Math.hypot(dotA.screenX - dotB.screenX, dotA.screenY - dotB.screenY);

            if (dist < LINE_MAX_DISTANCE) {
                ctx.beginPath();
                ctx.moveTo(dotA.screenX, dotA.screenY);
                ctx.lineTo(dotB.screenX, dotB.screenY);

                const scaleFactor = (dotA.gridY / currentGridSize + dotB.gridY / currentGridSize) / 2;
                const alpha = 1 - (dist / LINE_MAX_DISTANCE);
                ctx.globalAlpha = alpha * scaleFactor * 0.7; 

                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        function animateWave(time) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const currentGridSize = getGridSize();
            
            // Reinitialize if grid size unexpectedly changes during animation
            if (dots.length !== currentGridSize * currentGridSize) {
                initDots(currentGridSize);
            }

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            dots.forEach(dot => {
                dot.calculatePosition(centerX, centerY, time, currentGridSize);
            });

            drawLines(currentGridSize);

            dots.sort((a, b) => a.gridY - b.gridY);
            
            dots.forEach(dot => {
                dot.draw(centerX, centerY, time, currentGridSize);
            });

            animationFrameId = requestAnimationFrame(animateWave);
        }

        function resizeCanvas() {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            initDots(getGridSize()); 
            animateWave(0);
        }

        function handleMouseMove(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        function handleMouseOut() {
            mouseX = -999;
            mouseY = -999;
        }
        
        window.addEventListener('resize', resizeCanvas);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseOut);
        
        resizeCanvas();
    }
});