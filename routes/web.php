<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — SPA Catch-All
|--------------------------------------------------------------------------
| All routes serve the React SPA. API routes are handled in api.php.
*/

// Auth routes are loaded by RouteServiceProvider but we need them for session-based auth
require __DIR__.'/auth.php';

// SPA catch-all — must be last
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
