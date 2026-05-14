<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add avatar and role to users
        if (!Schema::hasColumn('users', 'avatar')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('avatar')->nullable()->after('email');
                $table->enum('role', ['user', 'admin'])->default('user')->after('avatar');
            });
        }

        // Sneaker parts reference table
        Schema::create('sneaker_parts', function (Blueprint $table) {
            $table->id();
            $table->string('part_name');        // e.g. "sole", "upper", "laces"
            $table->string('part_type');         // e.g. "color_zone", "accessory"
            $table->string('material')->nullable();
            $table->json('color_options')->nullable();
            $table->decimal('price_modifier', 8, 2)->default(0);
            $table->timestamps();

            $table->index('part_name');
            $table->index('part_type');
        });

        // Add design_name and is_public to shoe_designs
        if (!Schema::hasColumn('shoe_designs', 'design_name')) {
            Schema::table('shoe_designs', function (Blueprint $table) {
                $table->string('design_name')->nullable()->after('shoe_id');
                $table->string('design_thumbnail')->nullable()->after('template_name');
                $table->boolean('is_public')->default(false)->after('design_thumbnail');
                $table->string('share_token')->nullable()->unique()->after('is_public');
                $table->json('config_json')->nullable()->after('share_token');
                $table->string('size')->nullable()->after('config_json');
            });
        }

        // Orders table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('design_id')->nullable()->constrained('shoe_designs')->onDelete('set null');
            $table->string('status')->default('placed');
            $table->decimal('total_price', 10, 2);
            $table->text('shipping_address')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('tracking_number')->nullable()->unique();
            $table->enum('payment_status', ['pending', 'paid', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->string('size')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('tracking_number');
        });

        // Order items
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('shoe_id')->nullable()->constrained('shoes')->onDelete('set null');
            $table->decimal('price', 8, 2);
            $table->string('color')->nullable();
            $table->string('material')->nullable();
            $table->string('size')->nullable();
            $table->json('config_json')->nullable();
            $table->integer('quantity')->default(1);
            $table->timestamps();
        });

        // Payments
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('gateway');           // stripe, paypal, cod
            $table->string('transaction_id')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
            $table->decimal('amount', 10, 2);
            $table->timestamps();
        });

        // Order status updates
        Schema::create('order_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('status');
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_updates');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('sneaker_parts');

        if (Schema::hasColumn('users', 'avatar')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn(['avatar', 'role']);
            });
        }
        if (Schema::hasColumn('shoe_designs', 'design_name')) {
            Schema::table('shoe_designs', function (Blueprint $table) {
                $table->dropColumn(['design_name', 'design_thumbnail', 'is_public', 'share_token', 'config_json', 'size']);
            });
        }
    }
};
