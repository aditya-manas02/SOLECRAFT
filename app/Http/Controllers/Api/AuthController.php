<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AuthController extends Controller
{
    /**
     * POST /api/auth/register
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'user',
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'data'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
            'message' => 'Registration successful!',
            'errors'  => [],
        ], 201);
    }

    /**
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $key = 'login-attempts:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => "Too many login attempts. Try again in {$seconds} seconds.",
                'errors'  => ['rate_limit' => "Locked for {$seconds}s"],
            ], 429);
        }

        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($validated, $request->boolean('remember'))) {
            RateLimiter::hit($key, 900); // 15 min lockout
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Invalid credentials.',
                'errors'  => ['credentials' => 'Email or password is incorrect.'],
            ], 401);
        }

        RateLimiter::clear($key);
        $request->session()->regenerate();
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'data'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'role'  => $user->role,
            ],
            'message' => 'Login successful!',
            'errors'  => [],
        ]);
    }

    /**
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Logged out successfully.',
            'errors'  => [],
        ]);
    }

    /**
     * GET /api/auth/me
     */
    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Not authenticated.',
                'errors'  => [],
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'avatar' => $user->avatar,
                'role'   => $user->role,
                'created_at' => $user->created_at,
            ],
            'message' => '',
            'errors'  => [],
        ]);
    }

    /**
     * POST /api/auth/forgot-password
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        return response()->json([
            'success' => $status === Password::RESET_LINK_SENT,
            'data'    => null,
            'message' => $status === Password::RESET_LINK_SENT
                ? 'Password reset link sent to your email.'
                : 'Unable to send reset link.',
            'errors'  => [],
        ]);
    }

    /**
     * POST /api/auth/reset-password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));
                $user->save();
            }
        );

        return response()->json([
            'success' => $status === Password::PASSWORD_RESET,
            'data'    => null,
            'message' => $status === Password::PASSWORD_RESET
                ? 'Password reset successfully.'
                : 'Failed to reset password.',
            'errors'  => [],
        ]);
    }

    /**
     * PUT /api/auth/profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'data'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'role'  => $user->role,
            ],
            'message' => 'Profile updated.',
            'errors'  => [],
        ]);
    }

    /**
     * PUT /api/auth/password
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => ['required', 'confirmed', PasswordRule::min(8)],
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'data'    => null,
                'message' => 'Current password is incorrect.',
                'errors'  => ['current_password' => 'Does not match.'],
            ], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Password updated.',
            'errors'  => [],
        ]);
    }
}
