<?php

namespace App\Services;

use App\Models\Shoe;
use App\Models\Material;

class PricingService
{
    /**
     * Calculate live price based on configuration.
     */
    public function calculatePrice(Shoe $shoe, array $config): float
    {
        $total = $shoe->price;

        // Material modifier
        if (isset($config['material_id'])) {
            $material = Material::find($config['material_id']);
            if ($material) {
                $total += $material->price_modifier;
            }
        }

        // Custom Text / Monogram flat fee
        if (!empty($config['monogram'])) {
            $total += 15.00; // Flat fee for monogramming
        }

        // Artwork upload flat fee
        if (!empty($config['artwork_url'])) {
            $total += 25.00; // Flat fee for custom artwork processing
        }

        // Sole / Insole options
        if (isset($config['sole_option'])) {
            $soleFees = [
                'flat' => 0,
                'wedge' => 10.00,
                'sport' => 15.00,
                'orthopaedic' => 30.00
            ];
            $total += $soleFees[$config['sole_option']] ?? 0;
        }

        return round($total, 2);
    }
}
