<?php

namespace App\Http\Controllers;

use App\Models\Shoe;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $featuredShoes = Shoe::where('is_featured', true)->take(3)->get();
        return view('welcome', compact('featuredShoes'));
    }
}
