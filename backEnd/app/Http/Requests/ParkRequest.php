<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ParkRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'numberSpots' => 'nullable|integer|min:1',
        ];
    }

    /**
     * Get the custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name is required.',
            'name.string' => 'The name must be a string.',
            'name.max' => 'The name cannot exceed 255 characters.',
            'address.required' => 'The address is required.',
            'address.string' => 'The address must be a string.',
            'address.max' => 'The address cannot exceed 255 characters.',
            'numberSpots.required' => 'The number of spots is required.',
            'numberSpots.integer' => 'The number of spots must be an integer.',
            'numberSpots.min' => 'The number of spots must be at least 1.',
            'numberSpots.max' => 'The number of spots cannot exceed 1000.',
        ];
    }
}
