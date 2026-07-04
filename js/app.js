/**
 * Router & Navigation Logic for Iglesia Hogar Plaza Real (Google Sheets Enabled)
 */

// REPLACE THIS SPREADSHEET ID WITH YOUR PUBLIC GOOGLE SHEET ID
const SPREADSHEET_ID = '17hlEjPcKV7aPRXfvWPWzvipA3Dp6e4rG9JiRke6yAy0'; // ID de la hoja de Juan Carlos

// Fallback Mock Data in case fetch fails or Sheet is offline
const FALLBACK_DATA = {
    anuncios: [
        { category: 'Comunidad', date: 'Sábado, 6:00 PM', title: 'Reunión de Jóvenes', text: 'Este sábado a las 6:00 PM nos reuniremos para un tiempo especial de alabanza, palabra y compañerismo. Trae a un amigo, tendremos pizza al final.' },
        { category: 'Obra Social', date: 'Todo el mes', title: 'Recolección de Víveres', text: 'Estaremos recibiendo donaciones para las familias necesitadas. Por favor, traiga alimentos no perecederos al vestíbulo principal después de cada servicio.' },
        { category: 'Ministerios', date: 'Sábado, 10:00 AM', title: 'Taller de Alabanza', text: 'Invitamos a músicos y cantantes a participar en nuestro próximo taller de perfeccionamiento. Abordaremos técnicas vocales y de ensamble.' }
    ],
    refrigerio: [
        { date: 'Viernes, 24 Octubre', family: 'Familia Rodriguez', icon: 'restaurant' },
        { date: 'Viernes, 31 Octubre', family: 'Juan Pérez', icon: 'local_cafe' },
        { date: 'Viernes, 7 Noviembre', family: 'Ministerio Alabanza', icon: 'cake' }
    ],
    actividades: [
        { dateInfo: 'Sábado | Nov 15', time: '10am - 4pm', title: 'Día de Campo Familiar', location: 'Parque Centenario' },
        { dateInfo: 'Sábado | Nov 22', time: '8am - 1pm', title: 'Torneo de Fútbol', location: 'Canchas Deportivas Norte' },
        { dateInfo: 'Viernes | Dic 5', time: '7pm - 9:30pm', title: 'Noche de Cine Cristiano', location: 'Salón Principal de la Iglesia' }
    ],
    cumpleanos: [
        { name: 'Ana Martínez', date: '15 de Octubre' },
        { name: 'Carlos Rivera', date: '18 de Octubre' },
        { name: 'Familia López', date: '22 de Octubre' },
        { name: 'Elena Gómez', date: '28 de Octubre' }
    ],
    versiculos: [
        { category: 'Esperanza', passage: 'Salmos 23:1', text: 'Jehová es mi pastor; nada me faltará.' },
        { category: 'Fortaleza', passage: 'Filipenses 4:13', text: 'Todo lo puedo en Cristo que me fortalece.' }
    ],
    notificaciones: [
        { id: 'n1', date: 'Hoy', title: 'Cambio de Horario', message: 'El servicio de este martes iniciará a las 7:30 PM en lugar de las 7:00 PM.' }
    ],
    domingo: [
        { fecha: 'Domingo, 5 de Julio', anfitriones: 'Juan Pérez, María Gómez y Familia Rodríguez' }
    ],
    martes: [
        { fecha: 'Martes, 7 de Julio', ministrar: 'Estudio Bíblico General a cargo del Pastor' }
    ],
    recreacion: [
        { fecha: 'Domingo, 5 de Julio', nombre: 'Ana María y Carlos Pérez' },
        { fecha: 'Domingo, 12 de Julio', nombre: 'Laura Gómez y Pedro Rodríguez' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // Hash-to-View mapping
    const routes = {
        '#/portada': 'view-portada',
        '#/inicio': 'view-inicio',
        '#/servicio-domingo': 'view-servicio-domingo',
        '#/servicio-martes': 'view-servicio-martes',
        '#/anuncios': 'view-anuncios',
        '#/actividades': 'view-actividades',
        '#/lista-de-refrigerio': 'view-lista-de-refrigerio',
        '#/cumpleanos': 'view-cumpleanos',
        '#/recreacion-infantil': 'view-recreacion',
        '#/versiculos-de-viernes': 'view-versiculos-de-viernes'
    };

    const viewport = document.querySelector('.phone-viewport');

    function handleRouting() {
        const hash = window.location.hash || '#/portada';
        const targetViewId = routes[hash] || 'view-portada';

        // Hide bottom navigation on the cover page (portada)
        const bottomNavBar = document.querySelector('.phone-shell > nav');
        if (bottomNavBar) {
            if (hash === '#/portada') {
                bottomNavBar.classList.add('hidden');
            } else {
                bottomNavBar.classList.remove('hidden');
            }
        }

        const currentActiveView = document.querySelector('.app-view.active');
        const targetViewElement = document.getElementById(targetViewId);

        if (targetViewElement && currentActiveView !== targetViewElement) {
            // Prepare and show target (z-index 3 when active, z-index 1/2 during transition)
            targetViewElement.classList.remove('hidden');
            targetViewElement.offsetHeight; // Force layout calculation
            targetViewElement.classList.add('active');

            // Turn out the old view if it exists
            if (currentActiveView) {
                currentActiveView.classList.remove('active');
                currentActiveView.classList.add('turning-out');
                
                const oldView = currentActiveView;
                setTimeout(() => {
                    oldView.classList.add('hidden');
                    oldView.classList.remove('turning-out');
                }, 1200);
            }
        } else if (targetViewElement && !currentActiveView) {
            // Initial load fallback
            targetViewElement.classList.remove('hidden');
            targetViewElement.classList.add('active');
        }

        // Scroll back to top of viewport
        if (viewport) {
            viewport.scrollTo(0, 0);
        }

        // Update active states on bottom nav links
        updateNavigationBars(hash);
    }

    // Function to set active style on tab bars
    function updateNavigationBars(hash) {
        const bottomNavs = document.querySelectorAll('#bottom-nav a');
        bottomNavs.forEach(nav => {
            const href = nav.getAttribute('href');
            
            // Normalize routes to match parent tabs
            let isTabActive = (href === hash);
            if (hash === '#/servicio-domingo' && href === '#/inicio') isTabActive = true;
            if (hash === '#/servicio-martes' && href === '#/inicio') isTabActive = true;
            if (hash === '#/anuncios' && href === '#/inicio') isTabActive = true;

            if (isTabActive) {
                nav.className = "flex flex-col items-center justify-center text-ink font-bold hover:bg-paperDark transition-colors w-14 h-full rounded-lg translate-y-[-1px] transition-transform";
                const icon = nav.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.classList.add('fill');
                    icon.style.fontVariationSettings = "'FILL' 1";
                }
            } else {
                nav.className = "flex flex-col items-center justify-center text-inkLight hover:bg-paperDark transition-colors w-14 h-full rounded-lg";
                const icon = nav.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.classList.remove('fill');
                    icon.style.fontVariationSettings = "'FILL' 0";
                }
            }
        });
    }

    window.addEventListener('hashchange', handleRouting);
    
    // Initial routing & Clock
    handleRouting();
    setupClock();

    // Load data from Google Sheets or fallback
    loadAllData();
});

function setupClock() {
    const clockElement = document.getElementById('status-bar-clock');
    if (!clockElement) return;

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        clockElement.textContent = `${hours}:${minutes}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// Google Sheets Fetch Helper
async function fetchSheetData(sheetName) {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        // Parse Google Viz JSON wrapper
        const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const data = JSON.parse(jsonString);
        
        // Handle case where headers are not parsed automatically
        let cols = data.table.cols.map(c => c.label);
        let rowsData = data.table.rows;
        
        // If cols has no labels, assume the first row contains the headers
        if (data.table.parsedNumHeaders === 0 || cols.every(label => !label)) {
            if (rowsData.length > 0) {
                // Extract labels from the first row and remove it from rowsData
                cols = rowsData[0].c.map(cell => cell && cell.v ? cell.v.toString() : '');
                rowsData = rowsData.slice(1);
            }
        }

        // Extract rows
        const rows = rowsData.map(r => {
            const rowData = {};
            r.c.forEach((cell, idx) => {
                const label = cols[idx] || `col_${idx}`;
                rowData[String(label).toLowerCase().trim()] = cell ? cell.v : '';
            });
            return rowData;
        });
        
        // Filter out completely empty rows
        return rows.filter(row => Object.values(row).some(val => val !== '' && val !== null));
    } catch (e) {
        console.warn(`Error loading sheet: ${sheetName}. Using local fallback data.`, e);
        return null;
    }
}

// Load and populate views
async function loadAllData() {
    // 1. ANUNCIOS
    let anuncios = await fetchSheetData('Anuncios');
    if (!anuncios || anuncios.length === 0) anuncios = FALLBACK_DATA.anuncios;
    renderAnuncios(anuncios);

    // 2. REFRIGERIO
    let refrigerio = await fetchSheetData('Refrigerio');
    if (!refrigerio || refrigerio.length === 0) refrigerio = FALLBACK_DATA.refrigerio;
    renderRefrigerio(refrigerio);

    // 3. ACTIVIDADES
    let actividades = await fetchSheetData('Actividades');
    if (!actividades || actividades.length === 0) actividades = FALLBACK_DATA.actividades;
    renderActividades(actividades);

    // 4. CUMPLEANOS
    let cumpleanos = await fetchSheetData('Cumpleanos');
    if (!cumpleanos || cumpleanos.length === 0) cumpleanos = FALLBACK_DATA.cumpleanos;
    renderCumpleanos(cumpleanos);

    // 5. VERSICULOS (REFLEXIONES DE VIERNES)
    let versiculos = await fetchSheetData('Reflexiones');
    if (!versiculos || versiculos.length === 0) {
        versiculos = await fetchSheetData('Versiculos');
    }
    if (!versiculos || versiculos.length === 0) {
        versiculos = FALLBACK_DATA.versiculos;
    }
    renderVersiculos(versiculos);

    // 6. NOTIFICACIONES
    let notifications = await fetchSheetData('Notificaciones');
    if (!notifications || notifications.length === 0) notifications = FALLBACK_DATA.notificaciones;
    setupNotifications(notifications);

    // 7. DOMINGO
    let domingo = await fetchSheetData('Domingo');
    if (!domingo || domingo.length === 0) domingo = FALLBACK_DATA.domingo;
    renderDomingo(domingo);

    // 8. MARTES
    let martes = await fetchSheetData('Martes');
    if (!martes || martes.length === 0) martes = FALLBACK_DATA.martes;
    renderMartes(martes);

    // 9. RECREACION
    let recreacion = await fetchSheetData('Recreacion');
    if (!recreacion || recreacion.length === 0) {
        recreacion = await fetchSheetData('Recreacion Infantil');
    }
    if (!recreacion || recreacion.length === 0) {
        recreacion = FALLBACK_DATA.recreacion;
    }
    renderRecreacion(recreacion);
}

// RENDERERS
function renderAnuncios(list) {
    const container = document.querySelector('#view-anuncios main');
    if (!container) return;
    
    let html = '<div class="flex flex-col gap-12 max-w-3xl mx-auto">';
    list.forEach((item, idx) => {
        html += `
            <article class="flex flex-col gap-3 group">
                <div class="flex justify-between items-end border-b border-ink pb-2">
                    <span class="font-sans text-xs tracking-widest uppercase text-inkLight">
                        ${item.categoria || item.category || 'Comunidad'}
                    </span>
                    <span class="font-sans text-xs uppercase tracking-widest text-ink flex items-center gap-2">
                        ${cleanSheetDate(item.fecha || item.date)}
                    </span>
                </div>
                <h3 class="font-serif text-3xl text-ink leading-tight mt-2 group-hover:text-sepia transition-colors">${item.titulo || item.title || ''}</h3>
                <p class="font-serif text-lg text-inkLight leading-relaxed mt-2">
                    ${item.texto || item.text || ''}
                </p>
                <div class="mt-4">
                    <button class="font-sans text-[10px] tracking-widest uppercase text-ink border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors btn-add-calendar">
                        Añadir al calendario
                    </button>
                </div>
            </article>
        `;
        if (idx !== list.length - 1) {
            html += '<div class="editorial-divider opacity-10 mx-auto w-1/2"></div>';
        }
    });
    html += '</div>';
    container.innerHTML = html;
    
    // Bind mock calendar triggers
    container.querySelectorAll('.btn-add-calendar').forEach(b => {
        b.addEventListener('click', () => alert('¡Evento añadido al calendario!'));
    });
}

function renderRefrigerio(list) {
    const container = document.querySelector('#view-lista-de-refrigerio main');
    if (!container) return;

    let html = `
        <div class="text-center mb-10">
            <span class="font-serif italic text-2xl text-inkLight">"No se olviden de hacer el bien y de compartir..."</span>
            <div class="editorial-divider w-12 mx-auto my-3"></div>
            <span class="font-sans text-xs tracking-widest uppercase text-ink">Hebreos 13:16</span>
        </div>
        <div class="flex flex-col gap-8">
    `;
    list.forEach((item, idx) => {
        html += `
            <div class="flex items-center justify-between group">
                <div class="flex flex-col">
                    <span class="font-sans text-[10px] tracking-widest uppercase text-inkLight mb-1">${cleanSheetDate(item.fecha || item.date)}</span>
                    <h2 class="font-serif text-2xl text-ink group-hover:text-sepia transition-colors">${item.familia || item.family || ''}</h2>
                </div>
                <div class="w-10 h-10 border border-ink rounded-full flex items-center justify-center shrink-0 text-ink">
                    <span class="material-symbols-outlined text-[18px]">restaurant</span>
                </div>
            </div>
        `;
        if (idx !== list.length - 1) {
            html += '<div class="editorial-divider opacity-20 my-0"></div>';
        }
    });
    html += '</div>';
    container.innerHTML = html;
}

function renderActividades(list) {
    const container = document.querySelector('#view-actividades main');
    if (!container) return;

    let html = '<div class="flex flex-col gap-10">';
    list.forEach((item, idx) => {
        html += `
            <article class="flex flex-col group">
                <div class="border-b border-ink pb-2 mb-4 flex justify-between items-end">
                    <span class="font-sans text-[10px] tracking-widest uppercase text-ink">${cleanSheetDate(item.fecha_info || item.dateinfo)}</span>
                    <span class="font-sans text-[10px] tracking-widest uppercase text-inkLight">${item.hora || item.time || ''}</span>
                </div>
                <h3 class="font-serif text-3xl text-ink leading-tight group-hover:text-sepia transition-colors">${item.titulo || item.title || ''}</h3>
                <p class="font-serif italic text-lg text-inkLight mt-2">
                    Ubicación: ${item.lugar || item.location || ''}
                </p>
                <button class="mt-4 font-sans text-xs uppercase tracking-widest text-ink self-start border-b border-ink pb-1 hover:text-sepia hover:border-sepia transition-colors btn-activity-details">
                    Ver Detalles
                </button>
            </article>
        `;
    });
    html += '</div>';
    container.innerHTML = html;

    // Bind details mock
    container.querySelectorAll('.btn-activity-details').forEach(b => {
        b.addEventListener('click', (e) => {
            const title = e.target.closest('article').querySelector('h3').textContent;
            alert(`Detalles de la actividad "${title}":\nPróximamente más información.`);
        });
    });
}

function renderCumpleanos(list) {
    const container = document.querySelector('#view-cumpleanos main');
    if (!container) return;

    let html = `
        <div class="text-center mb-10">
            <span class="font-serif italic text-3xl text-ink">Celebraciones</span>
            <div class="editorial-divider w-12 mx-auto my-3"></div>
            <span class="font-sans text-xs tracking-widest uppercase text-inkLight">Mes de Octubre</span>
        </div>
        <div class="flex flex-col gap-6">
    `;
    list.forEach((item, idx) => {
        html += `
            <div class="flex flex-col text-center">
                <span class="font-sans text-[10px] tracking-widest uppercase text-inkLight mb-1">${cleanSheetDate(item.fecha || item.date)}</span>
                <h3 class="font-serif text-3xl text-ink">${item.nombre || item.name || ''}</h3>
            </div>
        `;
        if (idx !== list.length - 1) {
            html += '<div class="editorial-divider opacity-20 w-1/4 mx-auto my-0"></div>';
        }
    });
    html += '</div>';
    container.innerHTML = html;
}

function renderVersiculos(list) {
    const container = document.querySelector('#view-versiculos-de-viernes main');
    if (!container) return;

    let html = `
        <div class="text-center mb-10">
            <span class="font-serif italic text-3xl text-ink">Palabras de Vida</span>
            <div class="editorial-divider w-12 mx-auto my-3"></div>
            <span class="font-sans text-xs tracking-widest uppercase text-inkLight">Edición Semanal</span>
        </div>
        <div class="flex flex-col gap-12">
    `;
    list.forEach((item, idx) => {
        html += `
            <article class="flex flex-col items-center text-center group">
                <span class="font-sans text-[10px] tracking-widest uppercase text-inkLight mb-4 border border-ink px-3 py-1">
                    ${item.categoria || item.category || ''}
                </span>
                <blockquote class="font-serif italic text-3xl text-ink leading-relaxed mb-6 relative">
                    <span class="absolute -top-6 -left-4 text-6xl text-ink opacity-10">"</span>
                    ${item.texto || item.text || ''}
                    <span class="absolute -bottom-10 -right-4 text-6xl text-ink opacity-10">"</span>
                </blockquote>
                <h3 class="font-sans text-sm tracking-widest uppercase text-ink mt-2 group-hover:text-sepia transition-colors">— ${item.pasaje || item.passage || ''}</h3>
            </article>
        `;
        if (idx !== list.length - 1) {
            html += '<div class="editorial-divider opacity-20 w-1/3 mx-auto my-0"></div>';
        }
    });
    html += '</div>';
    container.innerHTML = html;
}

// 6. NOTIFICATIONS & MODAL CONTROLLER
function setupNotifications(list) {
    const triggerBtn = document.querySelector('header button'); // Bell icon
    if (!triggerBtn) return;

    const latestId = list.length > 0 ? (list[0].id || '0') : '0';
    const lastReadId = localStorage.getItem('last_read_notification_id');

    // Show/hide red badge indicator
    if (latestId !== '0' && latestId !== lastReadId) {
        showNotificationBadge(triggerBtn);
    }

    triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openNotificationsModal(list, latestId);
    });
}

function showNotificationBadge(button) {
    let badge = button.querySelector('.notification-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'notification-badge absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border border-primary';
        button.style.position = 'relative';
        button.appendChild(badge);
    }
}

function openNotificationsModal(list, latestId) {
    // Save last read notification ID to localStorage to dismiss badge
    localStorage.setItem('last_read_notification_id', latestId);
    const badge = document.querySelector('.notification-badge');
    if (badge) badge.remove();

    // Create modal elements
    let modal = document.getElementById('notifications-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'notifications-modal';
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-margin-mobile';
        document.body.appendChild(modal);
    }

    let listHtml = '';
    list.forEach(item => {
        listHtml += `
            <div class="border-b border-ink/10 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-sans text-[10px] text-sepia font-semibold uppercase">${cleanSheetDate(item.fecha || item.date || 'Aviso')}</span>
                </div>
                <h4 class="font-serif text-base font-bold text-ink">${item.titulo || item.title || ''}</h4>
                <p class="font-sans text-xs text-inkLight leading-relaxed mt-1">${item.mensaje || item.message || ''}</p>
            </div>
        `;
    });

    modal.innerHTML = `
        <div class="bg-paper rounded-lg w-full max-w-sm p-6 shadow-2xl border border-ink transform scale-95 opacity-0 transition-all duration-300" id="notifications-modal-card">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-serif text-xl font-bold text-ink flex items-center gap-2">
                    <span class="material-symbols-outlined text-ink" style="font-variation-settings: 'FILL' 1;">notifications_active</span>
                    Notificaciones
                </h3>
                <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-paperDark transition-colors text-ink" id="close-modal-btn">
                    <span class="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
            <div class="max-h-[300px] overflow-y-auto pr-1">
                ${listHtml || '<p class="text-xs text-inkLight text-center py-4 font-sans">No hay notificaciones en este momento.</p>'}
            </div>
        </div>
    `;

    // Animate modal open
    setTimeout(() => {
        const card = document.getElementById('notifications-modal-card');
        if (card) {
            card.classList.remove('scale-95', 'opacity-0');
            card.classList.add('scale-100', 'opacity-100');
        }
    }, 50);

    const closeBtn = document.getElementById('close-modal-btn');
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        const card = document.getElementById('notifications-modal-card');
        if (card) {
            card.classList.remove('scale-100', 'opacity-100');
            card.classList.add('scale-95', 'opacity-0');
        }
        setTimeout(() => {
            modal.remove();
        }, 200);
    }
}

// 7. GOOGLE SHEET DATE PARSER HELPER
function cleanSheetDate(dateStr) {
    if (!dateStr) return '';
    dateStr = String(dateStr).trim();
    // Match Google Sheet Visualization API Date structure, e.g. Date(2026,6,5) or Date(2026,6,5,8,30,0)
    const match = dateStr.match(/Date\((\d+),\s*(\d+),\s*(\d+)/i);
    if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]); // Google Sheets API month is 0-indexed (0 = Jan)
        const day = parseInt(match[3]);
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return `${day} de ${months[month]} de ${year}`;
    }
    return dateStr;
}

// 8. RENDER DOMINGO DYNAMIC DATA
function renderDomingo(list) {
    const dateEl = document.getElementById('domingo-date');
    const anfitrionesEl = document.getElementById('domingo-anfitriones');
    if (!list || list.length === 0) return;

    // Use the latest row (the first row)
    const latest = list[0];
    if (dateEl && latest.fecha) {
        dateEl.textContent = cleanSheetDate(latest.fecha);
    }
    if (anfitrionesEl && latest.anfitriones) {
        anfitrionesEl.textContent = latest.anfitriones;
    }
}

// 9. RENDER MARTES DYNAMIC DATA
function renderMartes(list) {
    const dateEl = document.getElementById('martes-date');
    const ministrarEl = document.getElementById('martes-ministrar');
    if (!list || list.length === 0) return;

    // Use the latest row (the first row)
    const latest = list[0];
    if (dateEl && latest.fecha) {
        dateEl.textContent = cleanSheetDate(latest.fecha);
    }
    if (ministrarEl && latest.ministrar) {
        ministrarEl.textContent = latest.ministrar;
    }
}

// 10. RENDER RECREACION INFANTIL DYNAMIC DATA
function renderRecreacion(list) {
    const container = document.querySelector('#view-recreacion main');
    if (!container) return;

    let html = `
        <div class="text-center mb-10">
            <span class="font-serif italic text-3xl text-ink">Servicio Infantil</span>
            <div class="editorial-divider w-12 mx-auto my-3"></div>
            <span class="font-sans text-xs tracking-widest uppercase text-inkLight">Colaboradores</span>
        </div>
        <div class="flex flex-col gap-8">
    `;
    list.forEach((item, idx) => {
        html += `
            <div class="flex items-center justify-between group">
                <div class="flex flex-col">
                    <span class="font-sans text-[10px] tracking-widest uppercase text-inkLight mb-1">${cleanSheetDate(item.fecha || item.date)}</span>
                    <h2 class="font-serif text-2xl text-ink group-hover:text-sepia transition-colors">${item.nombre || item.name || item.servidor || ''}</h2>
                </div>
                <div class="w-10 h-10 border border-ink rounded-full flex items-center justify-center shrink-0 text-ink">
                    <span class="material-symbols-outlined text-[18px]">child_care</span>
                </div>
            </div>
        `;
        if (idx !== list.length - 1) {
            html += '<div class="editorial-divider opacity-20 my-0"></div>';
        }
    });
    html += '</div>';
    container.innerHTML = html;
}
