<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'SOLECRFT — Premium Footwear')</title>
    
    <!-- Typography -->
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg: #FFFFFF;
            --bg-offset: #F5F5F0;
            --black: #111111;
            --accent: #FF4D2E;
            --text-muted: #666666;
            --border: #E5E5E0;
            --font-display: 'Bebas Neue', cursive;
            --font-body: 'DM Sans', sans-serif;
            --font-mono: 'Space Mono', monospace;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: var(--font-body);
        }

        body {
            background-color: var(--bg);
            color: var(--black);
            overflow-x: hidden;
        }

        h1, h2, h3, .display-text {
            font-family: var(--font-display);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        header {
            padding: 2rem 5%;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid var(--border);
        }

        .logo {
            font-family: var(--font-display);
            font-size: 2.5rem;
            color: var(--black);
            text-decoration: none;
            letter-spacing: -1px;
        }

        nav a {
            font-family: var(--font-display);
            font-size: 1.2rem;
            color: var(--black);
            text-decoration: none;
            margin-left: 3rem;
            transition: color 0.3s;
        }

        nav a:hover {
            color: var(--accent);
        }

        .btn {
            display: inline-block;
            padding: 1rem 2.5rem;
            font-family: var(--font-display);
            font-size: 1.1rem;
            text-decoration: none;
            text-transform: uppercase;
            border-radius: 0;
            transition: all 0.4s ease;
            cursor: pointer;
            border: 2px solid var(--black);
        }

        .btn-primary {
            background: var(--black);
            color: white;
        }

        .btn-primary:hover {
            background: var(--accent);
            border-color: var(--accent);
            transform: translateY(-3px);
        }

        .btn-outline {
            background: transparent;
            color: var(--black);
        }

        .btn-outline:hover {
            background: var(--black);
            color: white;
        }

        .pill {
            display: inline-block;
            padding: 0.4rem 1.2rem;
            border-radius: 50px;
            background: var(--bg-offset);
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
        }

        main {
            min-height: 80vh;
        }

        .price-tag {
            font-family: var(--font-mono);
            font-weight: 700;
            font-size: 1.2rem;
        }

        footer {
            padding: 6rem 5%;
            background: var(--bg-offset);
            border-top: 1px solid var(--border);
            text-align: center;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-up {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Editorial Grid */
        .editorial-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 2rem;
        }
    </style>
    @yield('styles')
</head>
<body>
    <header>
        <a href="/" class="logo">SOLECRFT</a>
        <nav>
            <a href="{{ route('shoes.index') }}">COLLECTIONS</a>
            @auth
                <a href="{{ route('orders.index') }}">ORDERS</a>
                <a href="{{ route('dashboard') }}">{{ strtoupper(Auth::user()->name) }}</a>
                <form method="POST" action="{{ route('logout') }}" style="display: inline; margin-left: 3rem;">
                    @csrf
                    <button type="submit" style="background: none; border: none; font-family: var(--font-display); font-size: 1.2rem; cursor: pointer;">LOGOUT</button>
                </form>
            @else
                <a href="{{ route('login') }}">LOGIN</a>
                <a href="{{ route('register') }}" class="btn btn-primary" style="margin-left: 3rem;">JOIN NOW</a>
            @endauth
        </nav>
    </header>

    <main>
        @yield('content')
    </main>

    <footer>
        <h2 style="font-size: 3rem; margin-bottom: 2rem;">SOLECRFT</h2>
        <p style="color: var(--text-muted); font-family: var(--font-mono);">© 2024 DESIGNED FOR EXCELLENCE. BUILT FOR INDIVIDUALS.</p>
    </footer>

    @yield('scripts')
</body>
</html>
