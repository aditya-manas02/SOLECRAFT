@extends('layouts.app')

@section('title', '3D Configurator — ' . $shoe->name)

@section('styles')
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/nano.min.css"/>
<style>
    .configurator-layout {
        display: grid;
        grid-template-columns: 350px 1fr 350px;
        height: calc(100vh - 80px);
        background: var(--bg);
    }

    .sidebar {
        padding: 2.5rem;
        border-right: 1px solid var(--border);
        overflow-y: auto;
        background: white;
        z-index: 10;
    }

    .sidebar-right {
        border-right: none;
        border-left: 1px solid var(--border);
    }

    .canvas-viewport {
        position: relative;
        background: var(--bg-offset);
        cursor: grab;
    }

    .canvas-viewport:active { cursor: grabbing; }

    #three-container {
        width: 100%;
        height: 100%;
    }

    .config-group {
        margin-bottom: 3rem;
    }

    .config-label {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--accent);
        letter-spacing: 2px;
        margin-bottom: 1.5rem;
        display: block;
    }

    .material-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .material-card {
        padding: 1rem;
        border: 1px solid var(--border);
        cursor: pointer;
        transition: 0.3s;
        text-align: center;
    }

    .material-card:hover, .material-card.active {
        border-color: var(--black);
        background: var(--bg-offset);
    }

    .zone-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid var(--border);
    }

    .price-display {
        position: absolute;
        bottom: 2rem;
        left: 2rem;
        background: var(--black);
        color: white;
        padding: 1.5rem 3rem;
        border-radius: 4px;
    }

    .price-display .amount {
        font-family: var(--font-display);
        font-size: 3.5rem;
        line-height: 1;
    }

    .action-bar {
        position: absolute;
        top: 2rem;
        right: 2rem;
        display: flex;
        gap: 1rem;
    }

    /* Monogram styles */
    #monogram-input {
        width: 100%;
        padding: 1rem;
        border: 1px solid var(--black);
        font-family: var(--font-mono);
        font-size: 1.2rem;
        text-transform: uppercase;
    }
</style>
@endsection

@section('content')
<div class="configurator-layout">
    <!-- Left Sidebar: Materials & Options -->
    <div class="sidebar">
        <div class="config-group">
            <span class="config-label">01 // MATERIAL SELECTOR</span>
            <div class="material-grid">
                @foreach($materials as $material)
                <div class="material-card" onclick="setMaterial('{{ $material->type }}', {{ $material->price_modifier }}, this)">
                    <div style="font-weight: 700; font-size: 0.8rem;">{{ strtoupper($material->name) }}</div>
                    <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">+${{ $material->price_modifier }}</div>
                </div>
                @endforeach
            </div>
        </div>

        <div class="config-group">
            <span class="config-label">02 // SOLE OPTIONS</span>
            <select class="btn btn-outline" style="width: 100%; text-align: left;" onchange="setSole(this.value)">
                <option value="flat">FLAT SOLE (FREE)</option>
                <option value="sport">SPORT PERFORMANCE (+$15)</option>
                <option value="wedge">WEDGE STYLE (+$10)</option>
                <option value="orthopaedic">ORTHOPAEDIC SUPPORT (+$30)</option>
            </select>
        </div>

        <div class="config-group">
            <span class="config-label">03 // DESIGN TEMPLATES</span>
            <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
                @foreach($templates as $template)
                <div class="material-card" style="display: flex; align-items: center; gap: 1rem; text-align: left;" onclick="loadTemplate({{ $template->design_json }})">
                    <div style="width: 50px; height: 50px; background: #eee;"></div>
                    <strong>{{ strtoupper($template->name) }}</strong>
                </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- Center: 3D Viewport -->
    <div class="canvas-viewport" style="position: relative;">
        <model-viewer id="shoe-viewer" 
            src="https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/shoe/model.gltf"
            alt="SoleCraft Reactive Sneaker"
            auto-rotate camera-controls
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1"
            style="width: 100%; height: 100%; background: #F5F5F0;">
            
            <div slot="poster" style="display: flex; justify-content: center; align-items: center; height: 100%; font-family: var(--font-mono); color: #111;">
                CALIBRATING INTERACTIVE ENGINE...
            </div>
        </model-viewer>
        
        <div class="price-display animate-up">
            <div id="debug-status" style="font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent); margin-bottom: 5px; opacity: 0.7;">ENGINE READY</div>
            <span style="font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 1px;">TOTAL ESTIMATE</span>
            <div class="amount" id="live-price">${{ number_format($shoe->price, 2) }}</div>
        </div>

        <div class="action-bar">
            <button class="btn btn-outline" onclick="saveDesign()">SAVE DESIGN</button>
            <button class="btn btn-primary" onclick="addToCart()">ADD TO BAG</button>
        </div>
    </div>

    <!-- Right Sidebar: Color Zones & Monogram -->
    <div class="sidebar sidebar-right">
        <div class="config-group">
            <span class="config-label">04 // COLOR ZONE PAINTER</span>
            @foreach(['TOE', 'SOLE', 'TONGUE', 'HEEL', 'LACES'] as $zone)
            <div class="zone-row">
                <span style="font-family: var(--font-mono); font-size: 0.8rem;">{{ $zone }}</span>
                <div class="color-picker-trigger" id="picker-{{ strtolower($zone) }}"></div>
            </div>
            @endforeach
        </div>

        <div class="config-group">
            <span class="config-label">05 // CUSTOM MONOGRAM</span>
            <input type="text" id="monogram-input" placeholder="ENTER INITIALS" maxlength="3" oninput="updateMonogram(this.value)">
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="pill" onclick="setMonogramStyle('embroidery')">EMBROIDERY</button>
                <button class="pill" onclick="setMonogramStyle('engraving')">ENGRAVING</button>
            </div>
        </div>

        <div class="config-group">
            <span class="config-label">06 // ARTWORK UPLOAD</span>
            <input type="file" id="logo-upload" style="display: none;" onchange="handleLogoUpload(this)">
            <button class="btn btn-outline" style="width: 100%;" onclick="document.getElementById('logo-upload').click()">UPLOAD PNG/SVG</button>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>

<script>
    const viewer = document.getElementById('shoe-viewer');
    
    function showToast(text) {
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:black; color:white; padding:10px 20px; font-family:var(--font-mono); font-size:12px; z-index:1000; border:1px solid var(--accent); opacity:0; transition:opacity 0.3s; pointer-events:none;';
        toast.innerText = text;
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2000);
    }
    
    // Configuration State
    let config = {
        shoe_id: {{ $shoe->id }},
        material_id: 'leather',
        material_price: 0,
        sole_option: 'flat',
        sole_price: 0,
        monogram: '',
        monogram_style: 'embroidery',
        zones: {
            'ToeBox': '#FFFFFF',
            'Sole': '#F5F5F0',
            'Laces': '#111111',
            'Heel': '#FFFFFF',
            'Tongue': '#FFFFFF'
        }
    };

    const basePrice = {{ $shoe->price }};

    // Deep-Scan Color Mapping
    const zoneMapping = {
        'toe': ['toe', 'upper', 'front', 'vamp', 'toebox', 'cap'],
        'sole': ['sole', 'midsole', 'bottom', 'outsole', 'strip'],
        'tongue': ['tongue', 'inner', 'liner'],
        'heel': ['heel', 'back', 'cap', 'counter', 'logo'],
        'laces': ['laces', 'string', 'tie', 'eyelet']
    };

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b, 1.0];
    }

    // Absolute Material Force
    async function updateZoneColor(uiZone, hex) {
        const keywords = zoneMapping[uiZone];
        config.zones[uiZone] = hex;
        const rgba = hexToRgb(hex);

        // Function to apply the color
        const apply = () => {
            if (!viewer.model) return false;
            let count = 0;
            viewer.model.materials.forEach(mat => {
                const name = mat.name.toLowerCase();
                if (keywords.some(k => name.includes(k))) {
                    // NUCLEAR: Clear any textures that might be overriding the color
                    if (mat.pbrMetallicRoughness.baseColorTexture) {
                        mat.pbrMetallicRoughness.baseColorTexture.setTexture(null);
                    }
                    mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
                    count++;
                }
            });
            return count > 0;
        };

        // Attempt immediate apply
        const success = apply();
        
        if (success) {
            showToast(`SUCCESS: PAINTED ${uiZone.toUpperCase()} RED`);
            document.getElementById('debug-status').innerText = `LAST ACTION: PAINTED ${uiZone.toUpperCase()}`;
        } else {
            // If model isn't ready, wait and try again
            viewer.addEventListener('load', apply, { once: true });
        }
        
        updatePrice();
    }

    // Highlighting Logic
    function highlightZone(uiZone, active) {
        const keywords = zoneMapping[uiZone];
        if (viewer && viewer.model) {
            viewer.model.materials.forEach(material => {
                const name = material.name.toLowerCase();
                if (keywords.some(k => name.includes(k))) {
                    material.setEmissiveFactor(active ? [0.2, 0.2, 0.2] : [0, 0, 0]);
                }
            });
        }
    }

    function setMaterial(type, price, el) {
        config.material_id = type;
        config.material_price = price;
        
        if (viewer && viewer.model) {
            viewer.model.materials.forEach(m => {
                if (!m.name.toLowerCase().includes('sole')) {
                    const roughness = type === 'suede' ? 0.9 : (type === 'mesh' ? 0.8 : 0.4);
                    m.pbrMetallicRoughness.setRoughnessFactor(roughness);
                }
            });
        }

        document.querySelectorAll('.material-card').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        updatePrice();
    }

    function setSole(option) {
        const prices = { flat: 0, sport: 15, wedge: 10, orthopaedic: 30 };
        config.sole_option = option;
        config.sole_price = prices[option];
        
        if (viewer && viewer.model) {
            viewer.model.materials.forEach(m => {
                if (m.name.toLowerCase().includes('sole')) {
                    if (option === 'sport') {
                        m.pbrMetallicRoughness.setBaseColorFactor([0.8, 0.8, 0.9, 1]); // Silver tint
                        m.pbrMetallicRoughness.setRoughnessFactor(0.0);
                        m.pbrMetallicRoughness.setMetallicFactor(1.0);
                    } else if (option === 'orthopaedic') {
                        m.pbrMetallicRoughness.setBaseColorFactor([0.1, 0.1, 0.1, 1]); // Deep black
                        m.pbrMetallicRoughness.setRoughnessFactor(1.0);
                        m.pbrMetallicRoughness.setMetallicFactor(0.0);
                    } else {
                        m.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]); // Classic white
                        m.pbrMetallicRoughness.setRoughnessFactor(0.5);
                        m.pbrMetallicRoughness.setMetallicFactor(0.1);
                    }
                }
            });
        }
        updatePrice();
        showToast(`SOLE UPGRADED TO: ${option.toUpperCase()}`);
    }

    // Initialize Pickrs & Hover Listeners
    window.addEventListener('load', () => {
        ['toe', 'sole', 'tongue', 'heel', 'laces'].forEach(zone => {
            // 1. Hover Feedback
            const row = document.querySelector(`#picker-${zone}`).closest('.zone-row');
            if (row) {
                row.addEventListener('mouseenter', () => highlightZone(zone, true));
                row.addEventListener('mouseleave', () => highlightZone(zone, false));
                row.style.cursor = 'pointer';
            }

            // 2. Pickr Init
            const el = document.querySelector(`#picker-${zone}`);
            if (!el) return;

            const pickr = Pickr.create({
                el: el,
                theme: 'nano',
                default: config.zones[zone] || '#FFFFFF',
                swatches: ['#FF4D2E', '#111111', '#FFFFFF', '#2E5BFF', '#2ECC71', '#F1C40F'],
                components: {
                    preview: true,
                    opacity: false,
                    hue: true,
                    interaction: { hex: true, input: true, save: true }
                }
            });

            pickr.on('change', (color) => {
                const hex = color.toHEXA().toString();
                updateZoneColor(zone, hex);
            });
        });
    });

    function updatePrice() {
        const total = basePrice + config.material_price + config.sole_price + (config.monogram ? 15 : 0);
        gsap.to('#live-price', {
            duration: 0.5,
            innerText: total.toFixed(2),
            snap: { innerText: 0.01 },
            onUpdate: function() {
                this.targets()[0].innerHTML = '$' + this.targets()[0].innerText;
            }
        });
    }

    async function saveDesign() {
        const btn = event.target;
        btn.innerText = 'SAVING...';
        
        try {
            const blob = await viewer.toBlob();
            const formData = new FormData();
            formData.append('shoe_id', config.shoe_id);
            formData.append('configuration', JSON.stringify(config.zones));
            formData.append('thumbnail', blob);

            const response = await fetch("{{ route('design.save') }}", {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
                body: formData
            });
            
            const data = await response.json();
            if(data.success) {
                alert('Design saved successfully!');
                btn.innerText = 'SAVE DESIGN';
            }
        } catch (e) {
            alert('Please login to save designs.');
            btn.innerText = 'SAVE DESIGN';
        }
    }

    async function addToCart() {
        const btn = event.target;
        btn.innerText = 'ADDING...';

        try {
            const response = await fetch("{{ route('cart.add') }}", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    shoe_id: config.shoe_id,
                    options: config
                })
            });
            
            const data = await response.json();
            if(data.success) {
                window.location.href = "{{ route('cart.index') }}";
            }
        } catch (e) {
            alert('Error adding to cart.');
            btn.innerText = 'ADD TO BAG';
        }
    }
</script>
@endsection
