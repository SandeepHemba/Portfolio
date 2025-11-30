document.addEventListener('DOMContentLoaded', () => {
    
    // --- NEW: MOBILE REDIRECT CHECK ---
    const MOBILE_BREAKPOINT = 768;

    function checkMobileAndRedirect() {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            // Find or create the overlay element
            let overlay = document.getElementById('mobile-warning-overlay');
            if (!overlay) {
                // If the element doesn't exist (because it wasn't added to the HTML), create it dynamically
                overlay = document.createElement('div');
                overlay.id = 'mobile-warning-overlay';
                overlay.innerHTML = `
                    <div class="warning-box">
                        <i class="fa-solid fa-desktop warning-icon"></i>
                        <h2 class="warning-title">Desktop View Recommended</h2>
                        <p class="warning-message">This portfolio is designed with a **Terminal/VS Code IDE** interface for the best experience. Please view it on a **desktop or tablet** for proper rendering and interactive functionality.</p>
                    </div>
                `;
                document.body.appendChild(overlay);
            }
            // Ensure the overlay is visible (CSS media query should handle this, but force it for safety)
            overlay.style.display = 'flex';
            
            // Hide main content (initial overview and portfolio)
            const mainPortfolio = document.getElementById('portfolio-main');
            const overviewScreen = document.getElementById('initial-overview');
            if (mainPortfolio) mainPortfolio.style.display = 'none';
            if (overviewScreen) overviewScreen.style.display = 'none';

            // Stop the rest of the script execution (important!)
            return true; 
        }
        return false;
    }

    // Check on load and resize
    if (checkMobileAndRedirect()) {
        window.addEventListener('resize', checkMobileAndRedirect);
        return; // Stop execution if on mobile
    }
    window.addEventListener('resize', checkMobileAndRedirect);
    
    // Select all existing elements
    const fileItems = document.querySelectorAll('.file-item');
    const sections = document.querySelectorAll('.cli-section');
    const activeTab = document.getElementById('active-tab');
    const cliInput = document.getElementById('cli-input');
    const cliHistory = document.getElementById('cli-history');
    const overviewScreen = document.getElementById('initial-overview');
    const mainPortfolio = document.getElementById('portfolio-main');
    const terminalOutput = document.getElementById('terminal-output');
    
    // NEW ELEMENTS
    const accessButton = document.getElementById('access-button');
    const loadingBar = document.querySelector('.loading-bar');

    // --- 0. INITIAL OVERVIEW SEQUENCE ---
    const OVERVIEW_DURATION_MS = 5000; 

    // Function to handle the final transition
    function finalizeTransition() {
        // 1. Animate the click
        accessButton.classList.add('clicking');
        
        setTimeout(() => {
            // 2. Hide the overview screen
            overviewScreen.classList.add('hidden');
            
            // 3. Show the main portfolio UI
            mainPortfolio.classList.add('visible');
        }, 300); // Wait for the click animation (0.2s + buffer)
    }

    // After the loading bar finishes (5 seconds)
    setTimeout(() => {
        loadingBar.classList.add('hidden');
        
        // Show the button and start the pulse animation
        accessButton.classList.add('visible');
        
        // 4. Auto-click the button after a small delay (1 second)
        setTimeout(() => {
            finalizeTransition();
        }, 1000); 

    }, OVERVIEW_DURATION_MS);
    
    // Allow manual click to bypass the final delay
    accessButton.addEventListener('click', finalizeTransition);


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

    // 1. Extract raw data from the hidden original #experience section
    const workCards = Array.from(document.querySelectorAll('#experience .exp-card[data-type="work"]')).map(card => card.outerHTML).join('');
    const eduCertCards = Array.from(document.querySelectorAll('#experience .exp-card[data-type="education"]')).map(card => card.outerHTML).join('');
    
    // 2. Hide the original combined section
    document.getElementById('experience').style.display = 'none';

    // 3. Create NEW Work Experience Section
    const workExperienceSection = document.createElement('section');
    workExperienceSection.id = 'experience-work';
    workExperienceSection.classList.add('cli-section');
    workExperienceSection.innerHTML = `
        <h3 class="section-title">WORK EXPERIENCE & ACHIEVEMENTS</h3>
        ${workCards}
    `;
    terminalOutput.insertBefore(workExperienceSection, document.getElementById('projects'));

    // 4. Create NEW Education Section
    const educationSection = document.createElement('section');
    educationSection.id = 'education';
    educationSection.classList.add('cli-section');
    educationSection.innerHTML = `
        <h3 class="section-title">EDUCATION & CERTIFICATIONS</h3>
        ${eduCertCards}
    `;
    terminalOutput.insertBefore(educationSection, document.getElementById('projects'));
    
    // 5. Update Sidebar Navigation Structure
    const sidebarNav = document.querySelector('.explorer-nav');
    
    const originalExperienceItem = document.querySelector('.file-item[data-filename="experience.log"]');
    if (originalExperienceItem) {
        originalExperienceItem.setAttribute('data-section', 'experience-work');
    }
    
    const educationItemHTML = `<a href="#" data-section="education" class="file-item" data-filename="education.cert">education.cert</a>`;
    const projectsItem = document.querySelector('.file-item[data-section="projects"]');
    if (projectsItem) {
        projectsItem.insertAdjacentHTML('beforebegin', educationItemHTML);
    }

    // Re-query all interactive elements 
    const newFileItems = document.querySelectorAll('.file-item');
    const newSections = document.querySelectorAll('.cli-section');

    function showSection(sectionId, fileName) {
        newSections.forEach(sec => {
            sec.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // DESKTOP SCROLL LOGIC
            const outputArea = document.getElementById('terminal-output');
            
            // For desktop, scroll the output area
            if (outputArea) {
                outputArea.scrollTop = targetSection.offsetTop - 20; 
            }
        }

        if (activeTab) {
            activeTab.querySelector('.filename').textContent = fileName;
        }
    }

    // Re-apply event listeners for sidebar navigation
    newFileItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            newFileItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const sectionId = item.getAttribute('data-section');
            const fileName = item.getAttribute('data-filename');
            showSection(sectionId, fileName);
        });
    });

    // Re-apply event listeners to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            // Check if we are in mobile/narrow mode for auto 'cat' command
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
        
        const outputArea = document.getElementById('terminal-output');
        
        // Scroll the CLI history to the bottom
        cliHistory.scrollTop = cliHistory.scrollHeight;

        if (targetSection) {
            const targetItem = document.querySelector(`.file-item[data-section="${targetSection}"]`);
            if (targetItem) {
                newFileItems.forEach(i => i.classList.remove('active'));
                targetItem.classList.add('active');
                showSection(targetSection, targetItem.getAttribute('data-filename'));
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

    // Set initial active state (using the updated query for file items)
    const initialItem = document.querySelector('.file-item.active');
    if (initialItem) {
        showSection(initialItem.getAttribute('data-section'), initialItem.getAttribute('data-filename'));
    }


    // --- 3. 3D WAVE CANVAS LOGIC ---

    const canvas = document.getElementById('wave-canvas');
    const ctx = canvas.getContext('2d');
    let dots = [];
    const GRID_SIZE = 30;
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

        calculatePosition(centerX, centerY, offsetTime) {
            const normalizedY = this.gridY / GRID_SIZE;
            const depth = 1 - normalizedY;
            const scale = 1 - depth * PERSPECTIVE_FACTOR;
            const radius = this.baseRadius * scale;

            const turbulenceY = Math.sin(offsetTime * 0.01 + this.wobbleOffset) * 2 * scale;

            let waveY = Math.sin((this.gridX + this.gridY) * 0.5 + offsetTime * WAVE_SPEED) * WAVE_AMPLITUDE * scale;
            waveY += turbulenceY;

            this.screenX = centerX + (this.gridX - GRID_SIZE / 2) * (canvas.width / GRID_SIZE) * scale * COVERAGE_FACTOR;
            this.screenY = centerY + (this.gridY - GRID_SIZE / 2) * (canvas.height / GRID_SIZE) * scale * COVERAGE_FACTOR + waveY;

            const distSq = Math.pow(this.screenX - mouseX, 2) + Math.pow(this.screenY - mouseY, 2);

            if (distSq < RIPPLE_RADIUS * RIPPLE_RADIUS) {
                const dist = Math.sqrt(distSq);
                const force = (1 - (dist / RIPPLE_RADIUS));
                this.screenY -= force * RIPPLE_FORCE;
            }

            return { radius, waveY, scale };
        }

        draw(centerX, centerY, offsetTime) {
            const { radius, waveY, scale } = this.calculatePosition(centerX, centerY, offsetTime);

            if (radius < 0.1) return;

            const dotColorStr = getComputedStyle(body).getPropertyValue('--wave-dot-color').trim();
            const shadowColor = getComputedStyle(body).getPropertyValue('--wave-shadow-color');

            ctx.globalAlpha = scale * 0.9;

            const normalizedWaveHeight = Math.abs(waveY) / WAVE_AMPLITUDE;

            ctx.shadowBlur = radius * 7 * normalizedWaveHeight * scale;
            ctx.shadowColor = shadowColor;

            ctx.beginPath();
            ctx.arc(this.screenX, this.screenY, radius, 0, Math.PI * 2, false);
            ctx.fillStyle = dotColorStr;
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.globalAlpha = 1;
        }
    }

    function initDots() {
        dots = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                dots.push(new Dot(x, y));
            }
        }
    }

    function drawLines() {
        const lineColor = getComputedStyle(body).getPropertyValue('--wave-line-color');
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;

        for (let i = 0; i < dots.length; i++) {
            const currentDot = dots[i];

            if (currentDot.gridX < GRID_SIZE - 1) {
                const rightDot = dots[i + 1];
                connectDots(currentDot, rightDot);
            }

            if (currentDot.gridY < GRID_SIZE - 1) {
                const bottomDot = dots[i + GRID_SIZE];
                connectDots(currentDot, bottomDot);
            }
        }
    }

    function connectDots(dotA, dotB) {
        const dist = Math.hypot(dotA.screenX - dotB.screenX, dotA.screenY - dotB.screenY);

        if (dist < LINE_MAX_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(dotA.screenX, dotA.screenY);
            ctx.lineTo(dotB.screenX, dotB.screenY);

            const scaleFactor = (dotA.gridY / GRID_SIZE + dotB.gridY / GRID_SIZE) / 2;
            const alpha = 1 - (dist / LINE_MAX_DISTANCE);
            ctx.globalAlpha = alpha * scaleFactor * 0.7; // Increased line brightness

            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    function animateWave(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        dots.forEach(dot => {
            dot.calculatePosition(centerX, centerY, time);
        });

        drawLines();

        dots.forEach(dot => {
            dot.draw(centerX, centerY, time);
        });

        animationFrameId = requestAnimationFrame(animateWave);
    }

    function resizeCanvas() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initDots();
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
});
