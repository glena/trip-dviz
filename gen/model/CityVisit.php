<?php

class CityVisit {

    public $id;
    public $name;
    public $country;
    public $latitude;
    public $longitude;
    public $points = array();
    
    public function __construct($id, $name, $country)
    {
        $this->id = $id;
        $this->name = $name;
        $this->country = $country;
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