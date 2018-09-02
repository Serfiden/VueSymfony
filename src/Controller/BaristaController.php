<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class BaristaController extends AbstractController
{
    /**
     * @Route("/barista", name="barista-menu", options={"expose": true})
     */
    public function index()
    {
        return $this->render('barista/index.html.twig');
    }
}
