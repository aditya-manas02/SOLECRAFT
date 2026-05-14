@extends('layouts.app')

@section('title', '3D Configurator - ' . $shoe->name)

@section('styles')
<style>
    .configurator-container {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
        height: calc(100vh - 120px);
        margin-top: -2rem;
    }

    .preview-canvas {
        background: radial-gradient(circle at center, #1e293b, #0f172a);
        border-radius: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .controls-panel {
        background: var(--card-bg);
        border-left: 1px solid var(--glass-border);
        padding: 2rem;
        overflow-y: auto;
    }

    .zone-path {
        transition: fill 0.3s ease;
        cursor: pointer;
    }

    .zone-path:hover {
        opacity: 0.8;
    }

    .control-group {
        margin-bottom: 2.5rem;
    }

    .control-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--text-muted);
        margin-bottom: 1rem;
    }

    .swatch-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0.8rem;
    }

    .swatch {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 10px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s;
    }

    .swatch.active {
        border-color: var(--primary);
        transform: scale(1.1);
    }

    .material-card {
        padding: 1rem;
        background: var(--bg);
        border: 1px solid var(--glass-border);
        border-radius: 15px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
    }

    .material-card.active {
        border-color: var(--primary);
        background: rgba(99, 102, 241, 0.1);
    }

    .monogram-input {
        width: 100%;
        padding: 1rem;
        background: var(--bg);
        border: 1px solid var(--glass-border);
        border-radius: 10px;
        color: white;
        font-size: 1.2rem;
        text-align: center;
    }

    .price-tag {
        font-size: 2rem;
        font-weight: 800;
        color: var(--accent);
    }
</style>
@endsection

@section('content')
<div class="configurator-container">
    <div class="preview-canvas">
        <!-- SVG Shoe Representation -->
        <svg id="shoe-svg" width="600" height="400" viewBox="0 0 600 400">
            <!-- Sole -->
            <path id="path-sole" class="zone-path" d="M100,300 Q300,350 500,300 L500,330 Q300,380 100,330 Z" fill="#222" />
            <!-- Main Body -->
            <path id="path-body" class="zone-path" d="M110,290 Q100,150 250,120 Q400,100 490,290 Z" fill="#eee" />
            <!-- Toe Cap -->
            <path id="path-toe" class="zone-path" d="M110,290 Q120,200 180,240 Q150,300 110,290 Z" fill="#ccc" />
            <!-- Heel -->
            <path id="path-heel" class="zone-path" d="M490,290 Q480,200 420,240 Q450,300 490,290 Z" fill="#ccc" />
            <!-- Laces Area -->
            <path id="path-laces" class="zone-path" d="M250,130 L350,150 L330,220 L270,200 Z" fill="#fff" />
            
            <!-- Monogram Text -->
            <text id="preview-monogram" x="430" y="260" font-family="Arial" font-size="14" fill="#000" text-anchor="middle" font-weight="bold"></text>
        </svg>

        <div style="position: absolute; bottom: 2rem; left: 2rem;">
            <p style="color: var(--text-muted); font-size: 0.9rem;">Model: {{ $shoe->name }}</p>
            <div class="price-tag" id="live-price">${{ $shoe->price }}</div>
        </div>
        
        <div style="position: absolute; top: 2rem; right: 2rem; display: flex; gap: 1rem;">
            <button class="btn" style="background: var(--glass);" onclick="rotateShoe()">🔄 Rotate</button>
            <button class="btn" style="background: var(--glass);" onclick="zoomShoe()">🔍 Zoom</button>
        </div>
    </div>

    <div class="controls-panel">
        <form action="{{ route('orders.place') }}" method="POST" id="config-form">
            @csrf
            <input type="hidden" name="shoe_id" value="{{ $shoe->id }}">
            <input type="hidden" name="configuration" id="config-json">
            
            <div class="control-group">
                <label class="control-label">1. Select Zone to Color</label>
                <select id="zone-selector" class="monogram-input" style="font-size: 0.9rem; text-align: left;">
                    <option value="body">Main Body</option>
                    <option value="toe">Toe Cap</option>
                    <option value="sole">Sole</option>
                    <option value="heel">Heel</option>
                    <option value="laces">Laces</option>
                </select>
            </div>

            <div class="control-group">
                <label class="control-label">2. Pick a Color</label>
                <div class="swatch-grid">
                    @foreach(['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#fbbf24', '#f472b6', '#a855f7', '#71717a', '#451a03'] as $color)
                        <div class="swatch" style="background: {{ $color }};" data-color="{{ $color }}" onclick="setColor('{{ $color }}', this)"></div>
                    @endforeach
                </div>
            </div>

            <div class="control-group">
                <label class="control-label">3. Material Selection</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="material-card active" onclick="setMaterial('leather', 0, this)">
                        <span style="display: block; font-size: 1.5rem;">🐄</span>
                        <strong>Leather</strong>
                        <p style="font-size: 0.7rem; color: var(--text-muted);">+$0.00</p>
                    </div>
                    <div class="material-card" onclick="setMaterial('suede', 15, this)">
                        <span style="display: block; font-size: 1.5rem;">🐏</span>
                        <strong>Suede</strong>
                        <p style="font-size: 0.7rem; color: var(--text-muted);">+$15.00</p>
                    </div>
                </div>
            </div>

            <div class="control-group">
                <label class="control-label">4. Personal Monogram</label>
                <input type="text" id="monogram-input" name="monogram" class="monogram-input" placeholder="ABC" maxlength="3" oninput="updateMonogram(this.value)">
                <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem;">Max 3 characters (Embroidery)</p>
            </div>

            <div class="control-group">
                <label class="control-label">5. Shipping Details</label>
                <input type="text" name="customer_name" placeholder="Full Name" class="monogram-input" style="font-size: 0.9rem; text-align: left; margin-bottom: 0.5rem;" required>
                <input type="email" name="customer_email" placeholder="Email Address" class="monogram-input" style="font-size: 0.9rem; text-align: left; margin-bottom: 0.5rem;" required>
                <textarea name="address" placeholder="Shipping Address" class="monogram-input" style="font-size: 0.9rem; text-align: left;" rows="3" required></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1.5rem; font-size: 1.1rem;">Place Order Now</button>
        </form>
    </div>
</div>
@endsection

@section('scripts')
<script>
    let config = {
        body: '#eee',
        toe: '#ccc',
        sole: '#222',
        heel: '#ccc',
        laces: '#fff',
        material: 'leather',
        material_price: 0,
        monogram: ''
    };

    const basePrice = {{ $shoe->price }};

    function setColor(color, el) {
        const zone = document.getElementById('zone-selector').value;
        config[zone] = color;
        document.getElementById('path-' + zone).setAttribute('fill', color);
        
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        el.classList.add('active');
        updateJSON();
    }

    function setMaterial(type, price, el) {
        config.material = type;
        config.material_price = price;
        
        document.querySelectorAll('.material-card').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        
        updatePrice();
        updateJSON();
    }

    function updateMonogram(val) {
        config.monogram = val;
        document.getElementById('preview-monogram').textContent = val;
        updateJSON();
    }

    function updatePrice() {
        const total = basePrice + config.material_price;
        document.getElementById('live-price').textContent = '$' + total.toFixed(2);
    }

    function updateJSON() {
        document.getElementById('config-json').value = JSON.stringify(config);
    }

    function rotateShoe() {
        const svg = document.getElementById('shoe-svg');
        svg.style.transition = 'transform 1s ease';
        svg.style.transform = svg.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
    }

    function zoomShoe() {
        const svg = document.getElementById('shoe-svg');
        svg.style.transition = 'transform 0.5s ease';
        svg.style.transform = svg.style.transform.includes('scale(1.5)') ? 'scale(1)' : 'scale(1.5)';
    }

    // Initialize
    updateJSON();
</script>
@endsection
