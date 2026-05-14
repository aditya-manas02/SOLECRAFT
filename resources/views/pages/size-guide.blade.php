@extends('layouts.app')

@section('title', 'SIZE & FIT ADVISOR // SOLECRFT')

@section('styles')
<style>
    .guide-container {
        max-width: 800px;
        margin: 10rem auto;
        padding: 0 5%;
    }

    .guide-h1 {
        font-size: 6rem;
        font-family: var(--font-display);
        line-height: 0.9;
        margin-bottom: 4rem;
    }

    .size-table {
        width: 100%;
        border-collapse: collapse;
        margin: 4rem 0;
    }

    .size-table th, .size-table td {
        padding: 1.5rem;
        border: 1px solid var(--border);
        text-align: center;
        font-family: var(--font-mono);
    }

    .size-table th {
        background: var(--bg-offset);
        color: var(--accent);
        font-size: 0.7rem;
    }

    .advisor-box {
        background: var(--black);
        color: white;
        padding: 4rem;
        margin-top: 6rem;
    }

    .measurement-step {
        margin-bottom: 3rem;
    }

    .step-num {
        font-family: var(--font-display);
        font-size: 3rem;
        color: var(--accent);
        display: block;
    }
</style>
@endsection

@section('content')
<div class="guide-container">
    <span class="section-label">ENGINEERING PRECISION</span>
    <h1 class="guide-h1">FIND YOUR<br>PERFECT FIT</h1>

    <div class="advisor-box animate-up">
        <h2 style="font-family: var(--font-display); font-size: 3rem; margin-bottom: 2rem;">HOW TO MEASURE</h2>
        
        <div class="measurement-step">
            <span class="step-num">01</span>
            <p style="font-size: 1.1rem; color: #ccc;">Place your foot on a blank sheet of paper with your heel against a wall.</p>
        </div>

        <div class="measurement-step">
            <span class="step-num">02</span>
            <p style="font-size: 1.1rem; color: #ccc;">Mark the longest part of your foot (heel-to-toe length) on the paper.</p>
        </div>

        <div class="measurement-step">
            <span class="step-num">03</span>
            <p style="font-size: 1.1rem; color: #ccc;">Measure the length with a ruler and compare it to our chart below.</p>
        </div>
    </div>

    <table class="size-table animate-up">
        <thead>
            <tr>
                <th>EU SIZE</th>
                <th>UK SIZE</th>
                <th>US SIZE (M)</th>
                <th>FOOT LENGTH (CM)</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>40</td><td>6</td><td>7</td><td>25.4</td></tr>
            <tr><td>41</td><td>7</td><td>8</td><td>26.0</td></tr>
            <tr><td>42</td><td>8</td><td>9</td><td>26.7</td></tr>
            <tr><td>43</td><td>9</td><td>10</td><td>27.3</td></tr>
            <tr><td>44</td><td>10</td><td>11</td><td>27.9</td></tr>
            <tr><td>45</td><td>11</td><td>12</td><td>28.6</td></tr>
        </tbody>
    </table>

    <div style="text-align: center; margin-top: 6rem;">
        <p style="color: var(--text-muted); margin-bottom: 2rem;">STILL UNSURE? OUR HALF-SIZES ENSURE A PERFECT LOCKDOWN.</p>
        <a href="{{ route('shoes.index') }}" class="btn btn-primary">BACK TO SHOP</a>
    </div>
</div>
@endsection
