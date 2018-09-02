<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class ClientController extends AbstractController
{
    /**
     * @Route(path="/client", name="client-menu", options={"expose": true})
     */
    public function index()
    {
        return $this->render('client/index.html.twig');
    }
}
