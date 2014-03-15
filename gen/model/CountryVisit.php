<?php

class CountryVisit {

    public $id;
    public $name;
    public $cities = array();
    
    public function __construct($id, $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public function addCity(CityVisit $city)
    {
    	$this->cities[] = $city;
    }
}

?>