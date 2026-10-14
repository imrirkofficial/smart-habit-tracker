<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
    ],


    'allowed_methods' => [
        '*',
    ],


    'allowed_origins' => [
        'https://delicate-stroopwafel-7e38e9.netlify.app',
        'http://localhost:8081',
        'http://localhost:19006',
    ],


    'allowed_origins_patterns' => [],


    'allowed_headers' => [
        '*',
    ],


    'exposed_headers' => [],


    'max_age' => 0,


    'supports_credentials' => false,

];