<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="login", options={"expose":true})
     */
    public function index()
    {
        return $this->render('home/home.html.twig');
    }
}
