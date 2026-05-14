<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="SOLECRAFT — Design your perfect custom sneaker. Choose materials, colors, soles, and create a one-of-a-kind shoe in our 3D configurator.">
    <meta name="keywords" content="custom sneakers, shoe customizer, 3D configurator, sneaker design">
    <meta name="author" content="SOLECRAFT">
    <meta name="theme-color" content="#E85D26">
    <meta property="og:title" content="SOLECRAFT — Custom Sneaker Studio">
    <meta property="og:description" content="Design your perfect sneaker with our real-time 3D configurator.">
    <meta property="og:type" content="website">
    <title>SOLECRAFT — Custom Sneaker Studio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
