<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'shoe_id' => 'required|exists:shoes,id',
            'configuration' => 'required|json',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'address' => 'required|string',
        ];
    }

    public function validated($key = null, $default = null)
    {
        $validated = parent::validated();
        $validated['config'] = json_decode($this->configuration, true);
        return $validated;
    }
}
