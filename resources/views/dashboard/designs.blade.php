@extends('layouts.app')

@section('title', 'DESIGN LIBRARY // SOLECRFT')

@section('styles')
<style>
    .design-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3rem;
        padding: 5rem 0;
    }

    .design-card {
        background: var(--bg-offset);
        padding: 2rem;
        position: relative;
        overflow: hidden;
    }

    .design-preview {
        width: 100%;
        aspect-ratio: 1;
        background: #eee;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .design-h3 {
        font-family: var(--font-display);
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .design-meta {
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--accent);
    }
</style>
@endsection

@section('content')
<div class="dashboard-container">
    <h1 class="dashboard-h1">MY LIBRARY</h1>

    <div class="design-grid">
        @forelse($designs as $design)
        <div class="design-card animate-up">
            <div class="design-preview">
                <img src="{{ $design->shoe->image }}" style="width: 80%; transform: rotate(-15deg);">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h3 class="design-h3">{{ strtoupper($design->shoe->name) }}</h3>
                    <span class="design-meta">SAVED ON {{ $design->created_at->format('M d') }}</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <a href="{{ route('shoes.customize', $design->shoe_id) }}" class="pill">EDIT</a>
                    <button class="pill" onclick="alert('Share link: {{ route('design.shared', $design->share_token) }}')">SHARE</button>
                </div>
            </div>
        </div>
        @empty
        <div style="grid-column: span 3; text-align: center; padding: 10rem 0;">
            <p style="font-size: 1.5rem; color: var(--text-muted); margin-bottom: 2rem;">YOUR DESIGN LIBRARY IS EMPTY.</p>
            <a href="{{ route('shoes.index') }}" class="btn btn-primary">START DESIGNING</a>
        </div>
        @endforelse
    </div>
</div>
@endsection
