<?php

class CityVisit {

    public $id;
    public $name;
    public $latitude;
    public $longitude;
    public $points = array();
    
    public function __construct($id, $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public function addPoint(PointVisit $point)
    {
        $count = count($this->points);

    	$this->points[$point->date][] = $point;
        
        $this->longitude = (($this->longitude * $count) + $point->longitude) / ($count + 1);
        $this->latitude = (($this->latitude * $count) + $point->latitude) / ($count + 1);

    }
}

?>