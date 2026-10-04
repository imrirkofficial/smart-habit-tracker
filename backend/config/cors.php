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


    /*
    |--------------------------------------------------------------------------
    | Development Origins
    |--------------------------------------------------------------------------
    |
    | Regex নিচে localhost এবং 127.0.0.1-এর যেকোনো dev port
    | allow করবে।
    |
    */

    'allowed_origins' => [],


    'allowed_origins_patterns' => [

        '#^http://localhost:\d+$#',

        '#^http://127\.0\.0\.1:\d+$#',

    ],


    'allowed_headers' => [
        '*',
    ],


    'exposed_headers' => [],


    'max_age' => 0,


    /*
    |--------------------------------------------------------------------------
    | Sanctum Bearer Token
    |--------------------------------------------------------------------------
    |
    | আপনার app Bearer token ব্যবহার করছে, cookie-based auth না।
    |
    */

    'supports_credentials' => false,

];