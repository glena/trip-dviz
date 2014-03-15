<?php

class CountryVisit {

    public $id;
    public $name;
    public $latitude;
    public $longitude;
    public $cities = array();
    
    public function __construct($id, $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public function addCity(CityVisit $city)
    {
        $count = count($this->cities);

    	$this->cities[] = $city;

        $this->longitude = (($this->longitude * $count) + $city->longitude) / ($count + 1);
        $this->latitude = (($this->latitude * $count) + $city->latitude) / ($count + 1);
    }
}

?>