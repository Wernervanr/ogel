<?php

declare(strict_types=1);

namespace App\Controller;

use Slim\Views\PhpRenderer;

class BaseController
{
    protected $viewRenderer;

    public function __construct()
    {
        $this->viewRenderer =  new PhpRenderer(__DIR__ . '/../View');
    }

    protected function getViewRenderer() : PhpRenderer
    {
        return $this->viewRenderer;
    }
}