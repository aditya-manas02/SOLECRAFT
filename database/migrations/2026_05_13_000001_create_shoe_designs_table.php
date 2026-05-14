<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shoe_designs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('shoe_id')->constrained('shoes')->onDelete('cascade');
            $table->string('material');
            $table->string('sole_type');
            $table->json('color_zones');
            $table->string('monogram_text', 3)->nullable();
            $table->enum('monogram_type', ['embroidery', 'engraving'])->nullable();
            $table->string('template_name')->nullable();
            $table->decimal('total_price', 8, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shoe_designs');
    }
};
