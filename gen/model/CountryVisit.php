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

    public function getCity($item)
    {
        $city = array_values(array_filter($this->cities, function($e) use ($item) {
            return $e->id == $item->city_id;
        }));

        if (count($city) == 0)
        {
            $cityVisit = new CityVisit($item->city_id, $item->city, $item->country);
            $this->cities[] = $cityVisit;
            return $cityVisit;
        }

        return $city[0];
    }

    protected static $countries = array();

    public static function All()
    {
        return self::$countries;
    }

    public static function Get($item)
    {
        $country = array_values(array_filter(self::$countries, function($e) use ($item) {
            return $e->id == $item->country_id;
        }));

        if (count($country) == 0)
        {
            $country = new CountryVisit($item->country_id, $item->country);
            self::$countries[] = $country;
            return $country;
        }

        return $country[0];
    }
}

?>