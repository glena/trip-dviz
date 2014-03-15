<?php

require 'model/CountryVisit.php';
require 'model/CityVisit.php';
require 'model/PointVisit.php';
require 'model/City.php';
require 'model/Country.php';

Country::Load(
	json_decode(file_get_contents('originaldata/countries.json'))
);

City::Load(
	json_decode(file_get_contents('originaldata/cities.json'))
);

$data = json_decode(file_get_contents('originaldata/export.json'));

$newdata = array();

$lastCountry = null;
$lastCity = null;
$obj = null;

foreach ($data as $item)
{
    if ($lastCountry != $item->country_id)
    {
    	$country = Country::Get($item->country_id);
		$countryVisit = new CountryVisit($item->country_id, $country->name);
		$newdata[] = $countryVisit;
    }

    if ($lastCity != $item->city_id)
    {
    	$city = City::Get($item->city_id);

    	if ($city === null)
    	{
    		var_dump($item);exit;
    	}

		$cityVisit = new CityVisit($item->city_id, $city->name);
		$countryVisit->addCity($cityVisit);
    }

	$pointVisit = new PointVisit($item);
	$cityVisit->addPoint($pointVisit);

}

var_dump($newdata);

//file_put_contents('generateddata/data.json', json_encode($newdata));

?>