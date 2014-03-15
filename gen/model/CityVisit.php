<?php

class CityVisit {

    public $id;
    public $name;
    public $points = array();
    
    public function __construct($id, $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public function addPoint(PointVisit $point)
    {
    	$this->points[$point->date][] = $point;
    }
}

?>